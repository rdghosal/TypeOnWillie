using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class Score
    {
        public int ScoreId { get; set; }
        public int UserId { get; set;  }
        public int SonnetId { get; set; }
        public float SuccessRate
        { 
            get => (int)Math.Round(SuccessRate); 
            set => SuccessRate = value;
        }
        public string[] Misspellings { get; set; }
    }
}
