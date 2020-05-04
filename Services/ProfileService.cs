using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.DataAccess;
using TypeOnWillie.Models;

namespace TypeOnWillie.Services
{
    public class ProfileService
    {
        private readonly TypeSessionSqlDao _daoTypeSessions;
        private readonly MisspellingSqlDao _daoMisspellings;


        public ProfileService(TypeSessionSqlDao typeSessionSqlDao, MisspellingSqlDao misspellingSqlDao)
        {
            _daoTypeSessions = typeSessionSqlDao;
            _daoMisspellings = misspellingSqlDao;
        }

        public UserProfileDto GetUserProfile(UserDto userDto)
        {
            UserProfileDto userProfileDto = new UserProfileDto();

            // Convert to List for access in view ?
            dynamic resTypeSessions = _daoTypeSessions.SelectScores();
            dynamic resMisspellings = _daoMisspellings.SelectMisspellings();

            return userProfileDto;
        }
    }
}
