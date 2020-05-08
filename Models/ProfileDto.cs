using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class ProfileDto
    {
        public User User { get; set; }
        public string FavoriteSonnet { get; set; }
        public int TopAccuracy { get; set; }
        public int TopWpm { get; set; }
        public int TopTime { get; set; }
        public ScoreCollection Scores { get; set; }
        public IEnumerable<WordTuple> TopMisspellings { get; set; }
    }
}
