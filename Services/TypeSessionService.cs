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

        public void AddTypeSession(TypeSession typeSession)
        {
            _dao.InsertTypeSession(typeSession);
            Console.WriteLine("Completed to write session.");
            _dao.InsertWordTuples(typeSession);
        }
    }
}
