using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;
using Microsoft.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Dapper;

namespace TypeOnWillie.DataAccess
{
    public class UserSqlDao : SqlDao
    {
        public UserSqlDao(SqlConnection sqlConnection) : base(sqlConnection)
        {
        }

        // TODO: move
        //public string GetConnectionString()
        //{
        //    return Environment.GetEnvironmentVariable(_connectionName.ToUpper());
        //}
        public User SelectUser(UserDto userDto)
        {
            using (_sqlConnection)
            {
                _sqlConnection.Open();
                return _sqlConnection.Query<User>(UserCommand.SELECT, new { username = userDto.Username }).FirstOrDefault();
            }
        }
        public int InsertUser(User user)
        {
            using (_sqlConnection)
            {
                return _sqlConnection.Execute(UserCommand.INSERT, new { username = user.Username });
            }
        }
    }
}
