using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class SonnetStatistic
    {
        public double AverageAccuracy { get; set; }
        public double AverageTime { get; set; }
        public double AverageWpm { get; set; }
        public ScopeType Scope { get; set; }
    }

    public enum ScopeType
    {
        GLOBAL,
        USER
    }
}
