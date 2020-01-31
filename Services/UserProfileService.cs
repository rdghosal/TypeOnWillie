using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;

namespace TypeOnWillie.Services
{
    public static class UserProfileService
    {
        public static UserProfileDto BuildUserProfile(User user, IEnumerable<Score> scores) 
        {
            // TODO insert filtering for scores
            return new UserProfileDto { UserData = user, Scores = scores };
        }
    }
}
