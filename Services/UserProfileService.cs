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
        private readonly TypeSessionSqlDao _dao;

        public UserProfileService(TypeSessionSqlDao typeSessionSqlDao)
        {
            _dao = typeSessionSqlDao;
        }

        public UserProfileDto GetUserProfile(UserDto userDto)
        {
            // Convert to List for access in view
            List<TypeSession> typeSessions = _dao.SelectTypeSessions(userDto).ToList();
            return new UserProfileDto { UserData = userDto, TypeSessions = typeSessions };
        }
    }
}
