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
        public static UserProfileDto GetUserProfile(User user, ScoreSqlDao scoreSqlDao)
        {
            // Convert to List for access in view
            List<Score> scores = scoreSqlDao.SelectScores(user).ToList();
            return new UserProfileDto { UserData = user, Scores = scores };
        }
    }
}
