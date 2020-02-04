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
        private readonly ScoreSqlDao _dao;

        public UserProfileService(ScoreSqlDao scoreSqlDao)
        {
            _dao = scoreSqlDao;
        }

        public UserProfileDto GetUserProfile(UserDto userDto)
        {
            // Convert to List for access in view
            List<Score> scores = _dao.SelectScores(userDto).ToList();
            return new UserProfileDto { UserData = userDto, Scores = scores };
        }
    }
}
