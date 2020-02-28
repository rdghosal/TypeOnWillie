using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class Sonnet
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public int WordCount { get; set; }
        
        public List<string> Lines { get; set; }
        
        public Sonnet()
        {
        }

        public Sonnet(int id, string title, int wordCount, List<string> lines)
        {
            Id = id;
            Title = title;
            WordCount = wordCount;
            Lines = lines;
        }
        
        public string GetFirstLine()
        {
            return Lines[0];
        }
    }
}
