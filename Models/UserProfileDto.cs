using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class UserProfileDto : Profile
    {
        public User User { get; set; }
    }
}
