using Microsoft.Data.SqlClient;
using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using TypeOnWillie.Models;

namespace TypeOnWillie.DataAccess
{
    public class AuthSqlDao : SqlDao
    {
        public AuthSqlDao(SqlConnection sqlConnection) : base(sqlConnection)
        {
        }

        public int InsertRefreshToken(User user, string refreshToken)
        {
            using (_sqlConnection)
            {
                return _sqlConnection.Execute(
                    AuthCommand.INSERT, 
                    new {
                        userId = user.Id,
                        expires = DateTime.Now.AddDays(5),
                        token = refreshToken
                    });
            }
        }

    }
}
