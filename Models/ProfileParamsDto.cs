using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class ProfileParamsDto
    {
        public string UserId { get; set; }
        public string EndDate { get; set; } = DateTime.Now.ToShortDateString();
        public ScaleType TimeScale { get; set; } = ScaleType.YEAR;

    }

    public enum ScaleType
    {
        YEAR,
        MONTH
    }
}
