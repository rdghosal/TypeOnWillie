﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class UserProfileDto
    {
        public User UserData { get; set; }
        public IEnumerable<Score> Scores { get; set; }
    }
}
