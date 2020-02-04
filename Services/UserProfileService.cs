using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.DataAccess;
using TypeOnWillie.Models;

namespace TypeOnWillie.Services
{
    public class UserProfileService
    {
        public UserProfileDto GetUserProfile(UserDto userDto, ScoreSqlDao scoreSqlDao)
        {
            // Convert to List for access in view
            List<Score> scores = scoreSqlDao.SelectScores(userDto).ToList();
            return new UserProfileDto { UserData = userDto, Scores = scores };
        }
    }
}
