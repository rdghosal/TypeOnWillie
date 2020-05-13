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

        public ProfileDto GetUserProfile(ProfileParamsDto params_)
        {
            return _daoTypeSessions.SelectProfile(params_);
        }
    }
}
