using Microsoft.Data.SqlClient;
using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using TypeOnWillie.Models;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;

namespace TypeOnWillie.DataAccess
{
    public class AuthSqlDao : SqlDao
    {

        private readonly IConfiguration _config;
        private readonly IDatabase _cache;

        public AuthSqlDao(SqlConnection sqlConnection, IConfiguration config, IDatabase cache) : base(sqlConnection)
        {
            _config = config;
            _cache = cache;
        }

        public dynamic SelectRefreshToken(string refreshToken)
        {
            using (_sqlConnection)
            {
                return _sqlConnection.Query(
                    AuthCommand.SELECT,
                    new
                    {
                        token = refreshToken
                    }).FirstOrDefault();
            }
        }

        public int InsertRefreshToken(User user, string refreshToken)
        {
            using (SqlConnection conn = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                return conn.Execute(
                    AuthCommand.INSERT, 
                    new {
                        userId = user.Id,
                        expires = DateTime.Now.AddDays(5),
                        token = refreshToken
                    });
            }
        }

        public void UpdateRefreshToken(string refreshToken)
        {
            using (SqlConnection sql = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                sql.Execute(AuthCommand.UPDATE, new { token = refreshToken });
            }
        }

        public async void AsyncCachedSetAdd(string setName, RedisValue value) 
        {
            await _cache.SetAddAsync(setName, value);
        }

    }
}
