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

        public int Length { get; set; }
        
        public List<string> Lines { get; set; }
        
        public Sonnet()
        {
        }

        public Sonnet(int id, string title, int length, List<string> lines)
        {
            Id = id;
            Title = title;
            Length = length;
            Lines = lines;
        }
        
        public string GetFirstLine()
        {
            return Lines[0];
        }
    }
}
