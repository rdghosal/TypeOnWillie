using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class TypeSession
    {
        public SqlGuid Id { get; set; }

        public string UserId { get; set; }

        public int SonnetId { get; set; }

        public int SecondsElapsed { get; set; }

        public int CorrectWordCount { get; set; } 

        public int TypedWordCount { get; set; } 

        public int MisspelledWordCount { get; set; }

        public string MisspelledWords { get; set; }

        public string Quit { get; set; }

        public string TouchScreen { get; set; }
    }
}
