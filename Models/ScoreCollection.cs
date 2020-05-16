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
        
        public DateTime Month { get; set; }

        public DateTime Day { get; set; }
    }

    public enum RangeType
    {
        YEAR,
        MONTH
    }
}
