using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class AverageTimeTuple : AverageScoreTuple
    {
        public double AverageTime { get; set; } = 0.0;

        public double GetInMinutes()
        {
            return AverageTime / 60;
        }
    }
}
