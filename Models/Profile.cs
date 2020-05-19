using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class Profile
    {
        public UserMetrics Metrics { get; set; }
        public PercentileCollection Percentiles { get; set; }
        public RecordCollection Records { get; set; }
        public IEnumerable<ScoreCollection> Scores { get; set; }
        public IEnumerable<string> TopMisspellings { get; set; }
    }
}
