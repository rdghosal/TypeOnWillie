using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class WordTuple
    {
        public SqlGuid Id { get; set; }
        public SqlGuid TypeSessionId { get; set; }
        public int LineNumber { get; set; }
        public int Index { get; set; }
        public string ModelWord { get; set; }
        public string TypedWord { get; set; }
    }
}
