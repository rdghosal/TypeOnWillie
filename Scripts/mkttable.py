import sys, os, csv, re, random
from time import sleep

MAX_SONNET_LEN = 14
IN_FIELDNAMES = ["Id", "UserId","SonnetId", "DateTime", "SecondsElapsed", "CorrectWordCount", \
        "TypedWordCount", "MisspelledWordCount", "Quit", "TouchScreen"]
OUT_FIELDNAMES = ["Id", "TypeSesssionId", "LineNumber", "Index", "ModelWord", "TypedWord"]


def load_sonnet(path, sonnet_store, sonnet_id):
    """Opens file with sonnet and loads to dict"""

    print(f"Loading sonnet {sonnet_id}...")
    
    with open(path, "r") as f:
        sonnet_store[sonnet_id] = list()
        line_cnt = 0
        for line in f.readlines():
            line_cnt += 1
            sonnet_store[sonnet_id].append(line.split())
        
    return sonnet_store
            

def generate_misspellings(csv_writer, sonnet_id, session_id, num_lines, sonnet_matrix):    

    idx_memo = dict()

    for i in range(num_lines):

        max_lines = len(sonnet_matrix)

        line_idx = random.randint(0, max_lines - 1) 
        word_idx = random.randint(0, len(sonnet_matrix[line_idx]) - 1)

        while line_idx in idx_memo.keys() and word_idx in idx_memo.get(line_idx):
            
            line_idx = random.randint(0, max_lines - 1) 
            word_idx = random.randint(0, len(sonnet_matrix[line_idx]) - 1)

        if not idx_memo.get(line_idx):
            idx_memo[line_idx] = []

        idx_memo[line_idx].append(word_idx)

        model_word = sonnet_matrix[line_idx][word_idx]

        csv_writer.writerow({
            OUT_FIELDNAMES[0]: "",
            OUT_FIELDNAMES[1]: session_id,
            OUT_FIELDNAMES[2]: line_idx + 1,
            OUT_FIELDNAMES[3]: word_idx,
            OUT_FIELDNAMES[4]: model_word,
            OUT_FIELDNAMES[5]: f"TEST_{line_idx+1}-{word_idx}"
        })
    


def main():
    
    if len(sys.argv) != 3:
        print("USAGE: mkttable.py <TEST_TS_CSV_PATH> <SONNETS_DIR_PATH>")
        return sys.exit(-1)

    test_ts_path = os.path.abspath(sys.argv[1])
    sonnet_dir_path = os.path.abspath(sys.argv[2])
    out_path = os.path.join(os.path.split(test_ts_path)[0],"test_misspellings.csv")

    sonnet_store = dict()

    with open(out_path, "w", newline="\n") as csv_out:

        writer = csv.DictWriter(f=csv_out, fieldnames=OUT_FIELDNAMES)
        row_cnt = 0

        with open(test_ts_path) as csv_in:        
            reader = csv.DictReader(f=csv_in, fieldnames=IN_FIELDNAMES)
            for line in reader:
                row_cnt += 1
                print(f"Reading row {row_cnt}")
                session_id = line[IN_FIELDNAMES[0]]
                sonnet_id = line[IN_FIELDNAMES[2]]
                num_misspellings = int(line[IN_FIELDNAMES[7]])

                for filename in os.listdir(sonnet_dir_path):
                    prefix = str(sonnet_id) + "_"
                    if re.search(r"^{0}".format(prefix), filename):
                        # Check cache first
                        if not sonnet_store.get(sonnet_id):
                            sonnet_store = load_sonnet(os.path.join(sonnet_dir_path, filename),\
                                 sonnet_store.copy(), sonnet_id)
                        # Add lines to csv_out
                        generate_misspellings(csv_writer=writer, sonnet_id=sonnet_id, session_id=session_id, num_lines=num_misspellings, \
                            sonnet_matrix=sonnet_store.get(sonnet_id))
    
    print(f"Finished generating test table at:\n {out_path}")    
    sys.exit(0)


if __name__ == "__main__":
    main()

        
