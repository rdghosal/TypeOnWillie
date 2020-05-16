using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class ProfileParamsDto
    {
        public string UserId { get; set; }

        public int Month { get; set; }

        public int Year { get; set; }

        public string CurrentDate { get; set; } = null;
    }
}
