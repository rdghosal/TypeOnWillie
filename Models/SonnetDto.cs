using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class SonnetDto
    {
        private const string _DELIMITER = "|";

        public SonnetDto(Sonnet sonnet)
        {
            Id = sonnet.Id;
            Title = sonnet.Title;
            WordCount = sonnet.WordCount;
            HasHistory = sonnet.HasHistory;
            Lines = sonnet.Text.Split(_DELIMITER);
        }

        public int Id { get; }

        public string Title { get; }

        public int WordCount { get; }
        public HistoryFlag HasHistory { get; }

        public IEnumerable<string> Lines { get; }
    }
}
