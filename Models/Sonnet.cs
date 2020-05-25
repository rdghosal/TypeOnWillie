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
        
        public string Text { get; set; }

        public HistoryFlag HasHistory { get; set; }

        public IEnumerable<string> GetTextAsLines()
        {
            return Text.Split("|");
        }
    }

    public enum HistoryFlag
    {
        FALSE,
        TRUE
    }
}
