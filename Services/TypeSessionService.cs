using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.DataAccess;
using TypeOnWillie.Models;

namespace TypeOnWillie.Services
{
    public class TypeSessionService
    {
        private readonly TypeSessionSqlDao _dao;

        public TypeSessionService(TypeSessionSqlDao typeSessionSqlDao)
        {
            _dao = typeSessionSqlDao;
        }

        public int AddTypeSession(TypeSession typeSession)
        {
            return _dao.InsertTypeSession(typeSession);
        }
    }
}
