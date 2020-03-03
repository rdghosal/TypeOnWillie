using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class User
    {
        public SqlGuid Id { get; }

        public string Username { get; }

        public string Hash { get; set; }

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
