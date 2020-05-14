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

        public ProfileService(TypeSessionSqlDao typeSessionSqlDao)
        {
            _daoTypeSessions = typeSessionSqlDao;
        }

        public ProfileDto GetUserProfile(ProfileParamsDto params_)
        {
            return _daoTypeSessions.SelectProfile(params_);
        }
    }
}
