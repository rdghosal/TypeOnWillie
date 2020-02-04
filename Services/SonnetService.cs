using Microsoft.VisualBasic.FileIO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;
using TypeOnWillie.DataAccess;

namespace TypeOnWillie.Services
{
    public class SonnetService
    {
        private readonly SonnetSqlDao _dao;

        public SonnetService(SonnetSqlDao sonnetSqlDao)
        {
            _dao = sonnetSqlDao;
        }
        public List<Sonnet> GetSonnets()
        {
            // Converts to List to be used by view
            return _dao.SelectSonnets().ToList();
        }
    }
}
