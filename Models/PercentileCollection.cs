using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class PercentileCollection 
    { 
        public double PunctuationPercentile { get; set; }
        public double CapitalLetterPercentile { get; set; }
        public double AccuracyPercentile { get; set; }
        public double WpmPercentile { get; set; }
        public double TimePercentile { get; set; }
    }
}
