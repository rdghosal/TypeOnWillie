using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class User
    {
        private Guid guid;
        private string name;
        
        public User(Guid guid, string name)
        {
            this.guid = guid;
            this.name = name;
        }
        public string Location { get; set; }
        public int Age { get; set; }
    }
}
