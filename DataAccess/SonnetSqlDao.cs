using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;
using Dapper;

namespace TypeOnWillie.DataAccess
{
    public class SonnetSqlDao : SqlDao
    {
        public SonnetSqlDao(SqlConnection sqlConnection) : base(sqlConnection)
        {
        }
        public IEnumerable<Sonnet> SelectSonnets()
        {
            using (_sqlConnection)
            {
                _sqlConnection.Open();
                return _sqlConnection.Query<Sonnet>(SonnetCommand.SELECT_ALL);
            }
        }
    }
}
