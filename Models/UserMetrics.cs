using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class UserMetrics
    {
        public double Punctuation { get; set; }
        public double CapitalLetters { get; set; }
        public double AverageAccuracy { get; set; }
        public double AverageWpm { get; set; }
        public double AverageTime { get; set; }
    }
}
