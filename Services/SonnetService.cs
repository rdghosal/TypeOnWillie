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
        public List<Sonnet> GetSonnets(SonnetSqlDao sonnetSqlDao)
        {
            // Converts to List to be used by view
            return sonnetSqlDao.SelectSonnets().ToList();
        }
    }
}
