#!usr/bin/env python3

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
    
    # where output csv file will be saved
    target_dir = sys.argv[1]

    # base URL used for data mining
    url = "http://shakespeare.mit.edu/Poetry/"

    main_page = requests.get(f"{url}sonnets.html")
    soup = BeautifulSoup(main_page.text, "html.parser")

    # pulls hrefs from anchor tags in the page that link to sonnets (and not elsewhere)
    links = [ link.get("href") for link in soup.find_all("a") if re.search(r"sonnet\.[CLXVI]+\.html", str(link)) ] 

    filename = "sonnet_data.csv"
    with open(os.path.join(target_dir, filename), "w") as csvfile:
        # same as the properties of class Sonnet
        fieldnames = ["sonnet_id", "title", "first_verse", "content"]
        cout = csv.DictWriter(csvfile, fieldnames)
        
        sonnetor = fetch_sonnet(url, links)
        sonnets = [ sonnet for sonnet in sonnetor ]

        rows = []

        # renders sonnet instance into CSV row
        for i in range(len(sonnets)):
            row = {
                fieldnames[0]: i,
                fieldnames[1]: sonnets[i].title,
                fieldnames[2]: sonnets[i].first_verse,
                fieldnames[3]: sonnets[i].content
            }

            rows.append(row) 

        cout.writeheader()
        cout.writerows(rows)

    # confirmation message
    print("Data written in {0}".format(os.path.abspath(filename)))

    # success
    sys.exit(0)


def fetch_sonnet(base_url, links):
    """generates Sonnet instance from sonnet link"""
    for link in links:
        sonnet_page = requests.get(base_url + link)
        sonnet_soup = BeautifulSoup(sonnet_page.text, "html.parser")
        
        lines = [ line for line in sonnet_soup.stripped_strings ]
        yield Sonnet(lines)
    

class Sonnet():

    def __init__(self, lines):
        self.__title = lines[0]
        self.__first_verse = lines[2] # tests reveal content starts from index 2
        self.__content = lines[2:]

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