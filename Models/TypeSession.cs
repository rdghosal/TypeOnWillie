﻿using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class TypeSession
    {
        public SqlGuid Id { get; set; }

        public SqlGuid UserId { get; set;  }

        public int SonnetId { get; set; }

        public int SecondsElapsed { get; set; }

        public int PercentCorrect { get; set; } 

        public string MisspelledWords { get; set; }
    }
}