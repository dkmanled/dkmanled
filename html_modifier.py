# html_modifier.py
import argparse
from bs4 import BeautifulSoup, Tag

def load_html(filepath):
    """Loads HTML content from a file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Error: File not found at {filepath}")
        return None
    except Exception as e:
        print(f"Error loading file: {e}")
        return None

def save_html(html_content, filepath):
    """Saves HTML content to a file."""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(html_content)) # Ensure content is string
        print(f"HTML content saved to {filepath}")
    except Exception as e:
        print(f"Error saving file: {e}")

def find_and_replace_snippet(html_content, old_snippet, new_snippet):
    """
    Finds a specific HTML snippet (as a string) and replaces it with another snippet.
    Warning: This is a simple string replacement. For complex HTML structures,
    a more sophisticated approach using BeautifulSoup's tree manipulation might be needed.
    """
    if old_snippet not in html_content:
        print(f"Warning: Old snippet not found in the HTML content.")
        # print(f"Old snippet:\n'''{old_snippet}'''")
        return html_content
    modified_content = html_content.replace(old_snippet, new_snippet)
    return modified_content

def insert_snippet_contextually(html_content, snippet_to_insert_str, context_clues):
    """Inserts an HTML snippet contextually based on clues using BeautifulSoup."""
    soup = BeautifulSoup(html_content, 'html.parser')

    snippet_soup = BeautifulSoup(f"<div>{snippet_to_insert_str}</div>", 'html.parser')
    parsed_snippets = [child for child in snippet_soup.div.contents if not (isinstance(child, str) and child.strip() == "")]

    if not parsed_snippets:
        print("Warning: Snippet to insert is empty or invalid (after stripping whitespace).")
        return str(soup)

    target_element = None

    # Prioritize target_selector if provided
    if 'target_selector' in context_clues and context_clues['target_selector']:
        target_element = soup.select_one(context_clues['target_selector'])
    else:
        # Fallback to tag, id, class if selector not given or empty
        target_tag_name = context_clues.get('target_tag')
        attrs_to_find = {}
        if 'target_id' in context_clues and context_clues['target_id']:
            attrs_to_find['id'] = context_clues['target_id']
        if 'target_class' in context_clues and context_clues['target_class']:
            attrs_to_find['class'] = context_clues['target_class']

        if target_tag_name:
            target_element = soup.find(target_tag_name, attrs=attrs_to_find)
        elif attrs_to_find:
            target_element = soup.find(attrs=attrs_to_find)
        # If only position is given, context_clues might not have enough for find.
        # e.g. if user only gives --position and no target specifiers. Argparse should prevent this.

    if not target_element:
        print(f"Warning: Target element not found with clues: {context_clues}")
        return str(soup)

    position = context_clues.get('position', 'append_child')

    if position in ['prepend_child', 'before']:
        parsed_snippets.reverse()

    for snippet_node in parsed_snippets:
        if position == 'append_child':
            target_element.append(snippet_node)
        elif position == 'prepend_child':
            target_element.insert(0, snippet_node)
        elif position == 'after':
            target_element.insert_after(snippet_node)
        elif position == 'before':
            target_element.insert_before(snippet_node)
        else:
            # This case should ideally be caught by argparse choices, but good for robustness
            print(f"Warning: Unknown position '{position}'. Defaulting to append_child.")
            target_element.append(snippet_node)

    return str(soup)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Modify HTML files by replacing or inserting snippets.")
    parser.add_argument("input_filepath", help="Path to the input HTML file.")
    parser.add_argument("output_filepath", help="Path to save the modified HTML file.")

    subparsers = parser.add_subparsers(dest="action", required=True, help="Action to perform")

    # Subparser for 'replace' action
    replace_parser = subparsers.add_parser("replace", help="Replace an HTML snippet.")
    replace_parser.add_argument("--old", required=True, help="The HTML snippet to be replaced.")
    replace_parser.add_argument("--new", required=True, help="The HTML snippet to replace with.")

    # Subparser for 'insert' action
    insert_parser = subparsers.add_parser("insert", help="Insert an HTML snippet contextually.")
    insert_parser.add_argument("--snippet", required=True, help="The HTML snippet to insert.")
    insert_parser.add_argument("--position", choices=['append_child', 'prepend_child', 'before', 'after'],
                               default='append_child', help="Position to insert the snippet.")

    # Group for targeting arguments in 'insert' action
    target_group = insert_parser.add_argument_group('Targeting Options (provide selector or tag/id/class)')
    target_group.add_argument("--target-selector", help="CSS selector for the target element.")
    target_group.add_argument("--target-tag", help="Tag name of the target element (e.g., 'div', 'p').")
    target_group.add_argument("--target-id", help="ID of the target element.")
    target_group.add_argument("--target-class", help="Class name of the target element.")

    args = parser.parse_args()

    # Validate targeting arguments for 'insert' action
    if args.action == "insert":
        if not args.target_selector and not args.target_tag and not args.target_id and not args.target_class:
            parser.error("For 'insert' action, you must provide --target-selector OR at least one of (--target-tag, --target-id, --target-class).")
        if not args.target_selector and not args.target_tag and (args.target_id or args.target_class):
             # Allow specifying id/class without a specific tag (will search all tags)
             # but if only id/class is given, and target_tag is None, it's fine.
             # The main check is that *some* targeting method is provided.
             pass


    print(f"Loading HTML from: {args.input_filepath}")
    html_content = load_html(args.input_filepath)

    if html_content is None:
        print("Exiting due to file loading error.")
        exit(1)

    modified_html = None
    original_html_for_comparison = html_content # Keep a copy for comparison

    if args.action == "replace":
        print(f"Action: Replace")
        print(f"--Old snippet:\n'''{args.old}'''")
        print(f"--New snippet:\n'''{args.new}'''")
        modified_html = find_and_replace_snippet(html_content, args.old, args.new)

    elif args.action == "insert":
        print(f"Action: Insert")
        print(f"--Snippet to insert:\n'''{args.snippet}'''")
        context_clues = {'position': args.position}
        if args.target_selector:
            context_clues['target_selector'] = args.target_selector
        # These keys are used directly by insert_snippet_contextually
        if args.target_tag:
            context_clues['target_tag'] = args.target_tag
        if args.target_id:
            context_clues['target_id'] = args.target_id
        if args.target_class:
            context_clues['target_class'] = args.target_class

        print(f"--Context clues: {context_clues}")
        modified_html = insert_snippet_contextually(html_content, args.snippet, context_clues)

    if modified_html is not None and modified_html != original_html_for_comparison:
        print(f"\nHTML has been modified. Saving to: {args.output_filepath}")
        save_html(modified_html, args.output_filepath)
    elif modified_html is not None and modified_html == original_html_for_comparison:
        print("\nHTML content was not changed by the operation (e.g., snippet not found, or target not found).")
        # Optionally, still save if user wants output file created regardless
        # print(f"Saving unchanged content to: {args.output_filepath}")
        # save_html(modified_html, args.output_filepath)
    else:
        # This case should not be reached if html_content was loaded successfully
        print("\nNo modification was performed or an unexpected error occurred.")

    print("\nHTML Modifier Script finished.")
