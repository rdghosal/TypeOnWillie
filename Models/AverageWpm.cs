using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class AverageWpm : AverageScore
    {
        public int Wpm { get; set; } = 0;
    }
}
