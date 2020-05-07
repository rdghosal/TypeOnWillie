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
        private readonly UserSqlDao _daoUsers;
        private readonly SonnetSqlDao _daoSonnets;


        public ProfileService(TypeSessionSqlDao typeSessionSqlDao, MisspellingSqlDao misspellingSqlDao, UserSqlDao userSqlDao, SonnetSqlDao sonnetSqlDao)
        {
            _daoTypeSessions = typeSessionSqlDao;
            _daoMisspellings = misspellingSqlDao;
            _daoUsers = userSqlDao;
            _daoSonnets = sonnetSqlDao;
        }

        public ProfileDto GetUserProfile(UserDto userDto, RangeType rt, DateTime start, DateTime end)
        {
            ProfileDto profileDto = new ProfileDto();

            profileDto.User = _daoUsers.SelectUser(userDto);
            profileDto.Scores = _daoTypeSessions.SelectScores(rt, start, end);
            profileDto.TopMisspellings = _daoMisspellings.SelectMisspellings();

            profileDto.FavoriteSonnet = _daoSonnets.SelectTopSonnet(userDto);
            profileDto.BestAccuracy = _daoTypeSessions.SelectTopAccuracy(userDto);
            profileDto.BestWpm = _daoTypeSessions.SelectTopWpm(userDto);
            profileDto.BestTime = _daoTypeSessions.SelectTopTime(userDto);

            // Convert to List for access in view ?
            return profileDto;
        }
    }
}
