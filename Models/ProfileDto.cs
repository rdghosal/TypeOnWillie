using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class ProfileDto
    {
        public User User { get; set; }
        public RecordCollection Records { get; set; }
        public ScoreCollection Scores { get; set; }
        public UserMetrics Metrics { get; set; }
        public IEnumerable<WordTuple> TopMisspellings { get; set; }
    }
}
