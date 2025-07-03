def get_user_input():
    name = input("Enter your name: ")
    return name

def main():
    name = get_user_input()
    print(f"Hello, {name}!")
    print(f"Your name is {name}.")
    print(f"Your name in uppercase is {name.upper()}.")
    print(f"The length of your name is {len(name)}.")

if __name__ == "__main__":
    main()
