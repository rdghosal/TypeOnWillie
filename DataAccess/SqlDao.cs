using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.DataAccess
{
    public class SqlDao
    {
        protected readonly SqlConnection _sqlConnection;
        public SqlDao(SqlConnection sqlConnection)
        {
            _sqlConnection = sqlConnection;
        }
    }
}
