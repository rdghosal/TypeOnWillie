using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class Sonnet
    {
        private int sonnetNum;
        private string title;
        private string verses;
        public Sonnet(int sonnetNum, string title, string verses)
        {
            this.sonnetNum = sonnetNum;
            this.title = title;
            this.verses = verses;
        }

        public string GetFirstVerse()
        {
            //TODO: check delimiter for data
            string firstVerse = verses.Split(", ")[0];
            return firstVerse;
        }
    }
}
