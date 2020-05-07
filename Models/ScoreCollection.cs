using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class ScoreCollection
    {
        private readonly RangeType _rangeType;
        private readonly DateTime _dtStart;
        private readonly DateTime _dtEnd = DateTime.Now;

        public ScoreCollection(DateTime dtStart)
        {
            _dtStart = dtStart;
        }

        public ScoreCollection(RangeType rangeType, DateTime dtStart)
        {
            _rangeType = rangeType;
            _dtStart = dtStart;
        }

        public ScoreCollection(RangeType rangeType, DateTime dtStart, DateTime dtEnd)
        {
            _rangeType = rangeType;
            _dtStart = dtStart;
            _dtEnd = dtEnd;
        }

        // (float)AVG(CorrectWordCount/TypedWordCount)
        IEnumerable<AverageAccuracy> AverageAccuracySet { get; set; }
        IEnumerable<AverageWpm> AverageWpmSet { get; set; }
    }

    public enum RangeType
    {
        YEAR,
        MONTH
    }
}
