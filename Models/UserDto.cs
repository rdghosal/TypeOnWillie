using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class UserDto
    {
        public SqlGuid Id { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public int Age { get; set; }

        public string Nationality { get; set; }

        public string HighestEducation { get; set; }
    }
}
