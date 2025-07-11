import unittest
import os
import tempfile
from bs4 import BeautifulSoup

# Assuming html_modifier.py is in the same directory or PYTHONPATH
from html_modifier import (
    load_html,
    save_html,
    find_and_replace_snippet,
    insert_snippet_contextually
)

class TestHtmlModifier(unittest.TestCase):

    def setUp(self):
        # Create a temporary directory for more complex file operations if needed
        # For now, NamedTemporaryFile within tests should suffice.
        self.base_html_content = """<html>
<head><title>Test</title></head>
<body>
    <div id="main">
        <p class="intro">Introduction</p>
        <ul class="items">
            <li>Item 1</li>
        </ul>
    </div>
    <div id="sidebar"></div>
</body>
</html>"""
        self.base_soup = BeautifulSoup(self.base_html_content, 'html.parser')

    def tearDown(self):
        # Clean up any persistent resources if setUp created them
        pass

    def test_load_html(self):
        with tempfile.NamedTemporaryFile(mode="w", delete=False, encoding="utf-8", suffix=".html") as tmpfile:
            tmpfile.write(self.base_html_content)
            filepath = tmpfile.name

        loaded_content = load_html(filepath)
        self.assertEqual(loaded_content, self.base_html_content)
        os.remove(filepath)

        # Test non-existent file
        non_existent_content = load_html("non_existent_file_12345.html")
        self.assertIsNone(non_existent_content)

        # Test empty file
        with tempfile.NamedTemporaryFile(mode="w", delete=False, encoding="utf-8", suffix=".html") as tmpfile_empty:
            filepath_empty = tmpfile_empty.name
        empty_content = load_html(filepath_empty)
        self.assertEqual(empty_content, "")
        os.remove(filepath_empty)

    def test_save_html(self):
        with tempfile.NamedTemporaryFile(mode="r", delete=False, encoding="utf-8", suffix=".html") as tmpfile:
            filepath = tmpfile.name

        save_html(self.base_html_content, filepath)

        with open(filepath, 'r', encoding='utf-8') as f:
            saved_content = f.read()
        self.assertEqual(saved_content, self.base_html_content)
        os.remove(filepath)

    def test_find_and_replace_snippet(self):
        html = "<html><body><p>Hello World</p><p>Hello Again</p></body></html>"

        # Basic replace
        modified = find_and_replace_snippet(html, "<p>Hello World</p>", "<p>Greetings Earthling</p>")
        self.assertIn("<p>Greetings Earthling</p>", modified)
        self.assertNotIn("<p>Hello World</p>", modified)

        # Snippet not found
        modified_no_change = find_and_replace_snippet(html, "<p>NonExistent</p>", "<p>NoShow</p>")
        self.assertEqual(modified_no_change, html)

        # Replace multiple occurrences (default string.replace behavior)
        modified_multiple = find_and_replace_snippet(html, "Hello", "Hi")
        self.assertEqual(modified_multiple.count("Hi"), 2)

        # Replace with empty string
        modified_empty_new = find_and_replace_snippet(html, "<p>Hello World</p>", "")
        self.assertNotIn("<p>Hello World</p>", modified_empty_new)
        self.assertIn("<p>Hello Again</p>", modified_empty_new) # Ensure other part remains

        # Replace empty string (should not change) - str.replace behavior
        # Note: This is not a very practical use case for this tool.
        # html.replace("", "anything") would insert "anything" between all characters.
        # Our function is designed for "snippets", so this test is more about string.replace behavior.
        # Let's assume an empty old_snippet means no change.
        # The current implementation `if old_snippet not in html_content` handles old_snippet="" as "in content".
        # So, html.replace("", "X") will indeed modify.
        # For this tool's purpose, replacing an "empty snippet" is ill-defined.
        # Let's test current behavior which is direct pass-through to str.replace.
        # modified_empty_old = find_and_replace_snippet(html, "", "<tag>")
        # self.assertNotEqual(modified_empty_old, html) # It will change the string

    def test_insert_snippet_contextually(self):
        # Single tag snippet
        footer_snippet = "<footer>Generated by test</footer>"
        # Multiple sibling tags snippet
        td_snippet = "<td>Cell A</td><td>Cell B</td>"

        # --- Targeting <body> ---
        # Append child to <body>
        clues_body_append = {'target_tag': 'body', 'position': 'append_child'}
        modified_html = insert_snippet_contextually(self.base_html_content, footer_snippet, clues_body_append)
        soup = BeautifulSoup(modified_html, 'html.parser')
        self.assertIsNotNone(soup.body.footer)
        self.assertEqual(soup.body.footer.text, "Generated by test")

        # Prepend child to <body>
        clues_body_prepend = {'target_tag': 'body', 'position': 'prepend_child'}
        modified_html = insert_snippet_contextually(self.base_html_content, footer_snippet, clues_body_prepend)
        soup = BeautifulSoup(modified_html, 'html.parser')
        self.assertEqual(soup.body.contents[0].name, 'footer') # First element in body

        # --- Targeting <div id="main"> ---
        # Append child to #main
        clues_main_append = {'target_id': 'main', 'position': 'append_child'}
        modified_html = insert_snippet_contextually(self.base_html_content, footer_snippet, clues_main_append)
        soup = BeautifulSoup(modified_html, 'html.parser')
        self.assertEqual(soup.find('div', id='main').contents[-1].name, 'footer')

        # Prepend child to #main (using target_tag and target_id)
        clues_main_prepend = {'target_tag': 'div', 'target_id': 'main', 'position': 'prepend_child'}
        modified_html = insert_snippet_contextually(self.base_html_content, footer_snippet, clues_main_prepend)
        soup = BeautifulSoup(modified_html, 'html.parser')
        self.assertEqual(soup.find('div', id='main').contents[0].name, 'footer')

        # Insert after #main (using selector)
        clues_main_after = {'target_selector': '#main', 'position': 'after'}
        modified_html = insert_snippet_contextually(self.base_html_content, footer_snippet, clues_main_after)
        soup = BeautifulSoup(modified_html, 'html.parser')
        self.assertEqual(soup.find('div', id='main').find_next_sibling().name, 'footer')

        # Insert before #main
        clues_main_before = {'target_id': 'main', 'position': 'before'}
        modified_html = insert_snippet_contextually(self.base_html_content, footer_snippet, clues_main_before)
        soup = BeautifulSoup(modified_html, 'html.parser')
        self.assertEqual(soup.find('div', id='main').find_previous_sibling().name, 'footer')

        # --- Targeting <p class="intro"> ---
        # Insert after p.intro (using tag and class)
        clues_p_after = {'target_tag': 'p', 'target_class': 'intro', 'position': 'after'}
        modified_html = insert_snippet_contextually(self.base_html_content, footer_snippet, clues_p_after)
        soup = BeautifulSoup(modified_html, 'html.parser')
        self.assertEqual(soup.find('p', class_='intro').find_next_sibling().name, 'footer')

        # Insert before p.intro (using selector)
        clues_p_before = {'target_selector': 'p.intro', 'position': 'before'}
        modified_html = insert_snippet_contextually(self.base_html_content, footer_snippet, clues_p_before)
        soup = BeautifulSoup(modified_html, 'html.parser')
        self.assertEqual(soup.find('p', class_='intro').find_previous_sibling().name, 'footer')

        # --- Targeting ul.items ---
        # Append child <li>New Item</li>
        li_snippet = "<li>New Item</li>"
        clues_ul_append = {'target_selector': 'ul.items', 'position': 'append_child'}
        modified_html = insert_snippet_contextually(self.base_html_content, li_snippet, clues_ul_append)
        soup = BeautifulSoup(modified_html, 'html.parser')
        self.assertEqual(soup.select_one('ul.items li:last-child').text, "New Item")

        # --- Inserting multiple tags ---
        # Insert <td>A</td><td>B</td> before <li>Item 1</li> (which is the first child of ul.items)
        clues_li_before_multi = {'target_selector': 'ul.items li:first-child', 'position': 'before'}
        modified_html = insert_snippet_contextually(self.base_html_content, td_snippet, clues_li_before_multi)
        soup = BeautifulSoup(modified_html, 'html.parser')
        item1_li = soup.select_one('ul.items li:contains("Item 1")') # Find the original "Item 1"
        self.assertIsNotNone(item1_li, "Could not find 'Item 1' list item after insertion.")
        prev_siblings = list(item1_li.previous_siblings) # Strips whitespace NavigableStrings
        # After reversing in the function for 'before', td_snippet "<td>Cell A</td><td>Cell B</td>"
        # parsed_snippets becomes effectively [Tag(B), Tag(A)]
        # Loop 1: snippet_node = Tag(A). target.insert_before(Tag(A)) -> HTML: ... <td>Cell A</td> <target>
        # Loop 2: snippet_node = Tag(B). target.insert_before(Tag(B)) -> HTML: ... <td>Cell B</td> <td>Cell A</td> <target>
        # So, item1_li.previous_sibling is "Cell A"
        # And item1_li.previous_sibling.previous_sibling is "Cell B"
        self.assertEqual(item1_li.previous_sibling.name, 'td')
        self.assertEqual(item1_li.previous_sibling.text, 'Cell A')
        self.assertEqual(item1_li.previous_sibling.previous_sibling.name, 'td')
        self.assertEqual(item1_li.previous_sibling.previous_sibling.text, 'Cell B')


        # --- Non-existent target ---
        clues_non_existent = {'target_selector': '#doesNotExist', 'position': 'append_child'}
        modified_html_no_change = insert_snippet_contextually(self.base_html_content, footer_snippet, clues_non_existent)
        self.assertEqual(BeautifulSoup(modified_html_no_change, 'html.parser').prettify(), self.base_soup.prettify())

        # --- Empty/invalid snippet ---
        modified_html_empty_snippet = insert_snippet_contextually(self.base_html_content, "", clues_body_append)
        self.assertEqual(BeautifulSoup(modified_html_empty_snippet, 'html.parser').prettify(), self.base_soup.prettify())

        modified_html_whitespace_snippet = insert_snippet_contextually(self.base_html_content, "   ", clues_body_append)
        self.assertEqual(BeautifulSoup(modified_html_whitespace_snippet, 'html.parser').prettify(), self.base_soup.prettify())

if __name__ == '__main__':
    unittest.main(argv=['first-arg-is-ignored'], exit=False)
    # Using exit=False for environments like notebooks/REPLs where sys.exit can be problematic.
    # For standard CLI execution, unittest.main() is fine.
