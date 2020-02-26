import requests, csv, os, re, sys
from time import sleep
from bs4 import BeautifulSoup


def main():

    if len(sys.argv) != 2:
        print("USAGE: shake_scraper.py <directory>")
        sys.exit(1)
    elif not os.path.isdir(sys.argv[1]):
        print("ERROR: directory does not exist!")
        sys.exit(2)
    
    # where sonnets are to be saved
    target_dir = sys.argv[1]
    dir_ = os.path.join(target_dir, "Sonnets")

    # make directory for sonnets
    if not os.path.exists(dir_):
        os.mkdir(dir_)

    print("Saving sonnets to {0}...".format(dir_))
    save_sonnets(dirname=dir_)
    
    # Confirmation message
    print("Data written in {0}".format(os.path.abspath(dir_)))

    # Success
    sys.exit(0)


def scrape_sonnets():
    """
    Generator yielding Sonnet objects encapsulating data scraped from URL
    """
    # Base URL used for data mining
    scrape_url = "http://shakespeare.mit.edu/Poetry/"

    def get_sonnet_links():
        """
        Generator for links to each sonnet
        """
        main_page = requests.get(f"{scrape_url}sonnets.html")
        soup = BeautifulSoup(main_page.text, "html.parser")

        # Pulls hrefs from anchor tags in the page that link to sonnets (and not elsewhere)
        for link in soup.find_all("a"):
            if re.search(r"sonnet\.[CLXVI]+\.html", str(link)):
                yield link.get("href")

    for link in get_sonnet_links():
        sonnet_page = requests.get(scrape_url + link)
        sonnet_soup = BeautifulSoup(sonnet_page.text, "html.parser")
        
        lines = [ line for line in sonnet_soup.stripped_strings ]
        yield Sonnet(lines)


def save_sonnets(dirname):
    """
    Saves Sonnets to specified directory, logging filenames to CSV
    """
    # Save each sonnet as separate textfile
    for i, sonnet in enumerate(scrape_sonnets()):
        index = i + 1
        filename = "{0}_{1}.txt".format(index, sonnet.title)

        # Write file contents                
        with open(os.path.join(dirname, filename), "w", encoding="utf-8") as f:
            f.writelines(sonnet.content)


class Sonnet():

    def __init__(self, lines):
        self.__title = lines[0]
        self.__first_verse = lines[2] # Content starts from index 2
        self.__content = [ line + "\n" for line in lines[2:] ]

    def __str__(self):
        return "{0}\n{1}...".format(self.__title, self.__first_verse) 

    def __repr__(self):
        return "Sonnet({0})".format(self.__title) 

    @property
    def title(self):
        return self.__title

    @property
    def first_verse(self):
        return self.__first_verse
    
    @property
    def content(self):
        return self.__content
    
    
if __name__ == "__main__":
    main()