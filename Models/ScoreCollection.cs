using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class ScoreCollection
    {
        public double AverageAccuracy { get; set; }

        public double AverageTime { get; set; }

        public int AverageWpm { get; set; }
        
        public int Month { get; set; }

        public int Day { get; set; }
    }
}
