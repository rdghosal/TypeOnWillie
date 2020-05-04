using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class UserProfileDto
    {
        public UserDto UserData { get; set; }
        public string FavoriteSonnet { get; set; }
        public int BestAccurary { get; set; }
        public int BestTime { get; set; }
        public IEnumerable<ScoreCollection> ScoreCollection { get; set; }
        public IEnumerable<WordTuple> CommonMisspellings { get; set; }
    }
}
