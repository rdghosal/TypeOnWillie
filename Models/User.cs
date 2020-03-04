using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class User
    {
        public Guid Id { get; set; }

        public string Username { get; set; }

        public string Hash { get; set; }

        public int Age { get; set; }

        public string Nationality { get; set; }

        public string HighestEducation { get; set; }

        public User()
        {
        }

        public User (string username)
        {
            Username = username;
        }
        
        public User(string username, string hash)
        {
            Username = username;
            Hash = hash;
        }
    }
}
