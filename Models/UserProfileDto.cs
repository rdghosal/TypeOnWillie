using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class UserProfileDto
    {
        public UserDto UserData { get; set; }
        public IEnumerable<TypeSession> TypeSessions { get; set; }
    }
}
