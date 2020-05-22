using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class Misspelling
    {
        public string ModelWord { get; set; }
        public int Frequency { get; set; }
        public int LineNumber { get; set; }
        public int Index { get; set; }
        public ScopeType Scope { get; set; }
    }
}
