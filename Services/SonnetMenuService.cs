using Microsoft.VisualBasic.FileIO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;
using TypeOnWillie.DataAccess;

namespace TypeOnWillie.Services
{
    public static class SonnetMenuService
    {
        public static IEnumerable<Sonnet> GetSonnets()
        {
            // TODO: Make less tightly coupled
            return new SqlDao("mssql").LoadSonnets();
        }
    }
}
