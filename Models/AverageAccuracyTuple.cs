using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class AverageAccuracyTuple : AverageScoreTuple
    {
        public double AverageAccuracy { get; set; } = 0.0;
    }
}
