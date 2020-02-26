using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class Sonnet
    {
        public int SonnetId { get; }
        public string Number { get; }
        public List<string> Text { get; }
        public Sonnet(int sonnetId, string number, List<string> text)
        {
            SonnetId = sonnetId;
            Number = number;
            Text = text;

        }
        public string GetFirstLine()
        {
            return Text[0];
        }
    }
}
