using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class ScoreCollection
    {
        // TODO add TimeRange field?

        // SecondElapsed
        IEnumerable<int> AvgTimeSeries { get; set; } 

        // (float)AVG(CorrectWordCount/TypedWordCount)
        IEnumerable<float> AvgAccuracySeries { get; set; }

        // DateTime
        IEnumerable<int> TimeSeries { get; set; }
    }
}
