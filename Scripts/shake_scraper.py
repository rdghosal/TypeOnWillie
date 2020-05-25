import requests, csv, os, re, sys
from time import sleep
from bs4 import BeautifulSoup


def main():

    if len(sys.argv) != 2:
        print("USAGE: shake_scraper.py <directory>")
        sys.exit(1)
    elif not os.path.isdir(sys.argv[1]):
        print("ERROR: Input path is not a valid directory!")
        sys.exit(2)
    
    # Where sonnets are to be saved
    target_dir = sys.argv[1]

    save_sonnets(dirname=target_dir)    

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
        
        yield Sonnet(list(sonnet_soup.stripped_strings))


def save_sonnets(dirname):
    """
    Saves Sonnets to specified directory, logging filenames to CSV
    """
    csv_path = os.path.join(dirname, "sonnet_map.csv")

    # Save sonnet data to CSV
    with open(csv_path, "w", encoding="utf-8", newline="") as sonnet_csv:

        fieldnames = ["id", "sonnet_length", "punctuation_freq", "cap_letter_freq",\
             "title", "text"]
        writer = csv.DictWriter(fieldnames=fieldnames, f=sonnet_csv, delimiter="\t")

        for i, sonnet in enumerate(scrape_sonnets()):

            print(f"Writing Sonnet {i + 1} to CSV file...")

            sonnet_len = 0 # Count for number of words
            punctuation_cnt = 0 # Count for punctuation
            cap_letter_cnt = 0 # Count for all capital letters

            # Write sonnet contents to text file         
            for line in sonnet.text:                    
                punctuation_cnt += len(re.findall(r"[-,.;:!?\"'\[\]]",line))
                cap_letter_cnt += len(re.findall(r"\b\w*[A-Z]\w*\b", line)) 

                sonnet_len += len(line.split())

            # Write sonnet metadata to csv            
            writer.writerow({
                fieldnames[0]: None, # To allow auto-incrementing in SQL
                fieldnames[1]: sonnet_len,
                fieldnames[2]: cap_letter_cnt,
                fieldnames[3]: punctuation_cnt,
                fieldnames[4]: sonnet.title,
                fieldnames[5]: "|".join(sonnet.text)
            })

    # Confirmation message
    print("Sonnet data saved in: {0}".format(
        os.path.abspath(csv_path)
        ))


class Sonnet():

    def __init__(self, lines):
        self.__title = lines[0]
        self.__first_verse = lines[2] # Content starts from index 2
        self.__text = lines[2:]

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
    def text(self):
        return self.__text
    
    
if __name__ == "__main__":
    main()
