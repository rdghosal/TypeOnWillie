using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class RecordCollection
    {
        public int BestAccuracySonnet { get; set; }
        public int WorstAccuracySonnet { get; set; }
        public double BestAccuracy { get; set; }
        public double WorstAccuracy { get; set; }

        public int BestTimeSonnet { get; set; }
        public int WorstTimeSonnet { get; set; }
        public int BestTime { get; set; }
        public int WorstTime { get; set; }

        public int BestWpmSonnet { get; set; }
        public int WorstWpmSonnet { get; set; }
        public double BestWpm { get; set; }
        public double WorstWpm { get; set; }
    }
}
