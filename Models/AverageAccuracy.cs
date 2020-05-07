using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class AverageAccuracy : AverageScore
    {
        public double Accuracy { get; set; } = 0.0;
    }
}
