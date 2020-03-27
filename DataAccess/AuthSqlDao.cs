using Microsoft.Data.SqlClient;
using System;
using System.Data;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using TypeOnWillie.Models;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;
using System.Reflection;

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

        public async Task<dynamic> AsyncSelectRefreshToken(string refreshToken)
        {
            if (_cache.SetContains("refresh_blacklist", refreshToken))
            {
                return null;
            }

            // Use substring of token as key and query cache for user data
            string key = refreshToken.Substring(0, 10);
            bool exists = await _cache.HashExistsAsync(key, "UserId");

            if (!exists)
            {
                // If no cache available, query db and set cache
                SetRefreshCache(refreshToken);
            }

            // Fech user data from cache
            IDictionary<string, string> userData = new Dictionary<string, string>();
            HashEntry[] hashEntries = await _cache.HashGetAllAsync(key);

            foreach (HashEntry he in hashEntries)
            {
                // Populate the return data structure
                userData[he.Name] = he.Value;
            }

            return userData;
        }

        public int InsertRefreshToken(User user, string refreshToken)
        {
            int numInserted;
            using (SqlConnection conn = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                 numInserted = conn.Execute(
                    AuthCommand.INSERT, 
                    new {
                        UserId = user.Id,
                        Expires = DateTime.Now.AddDays(5),
                        Token = refreshToken
                    });
            }

            SetRefreshCache(refreshToken);
            return numInserted;
        }

        public void UpdateRefreshToken(string refreshToken)
        {
            using (SqlConnection sql = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                sql.Execute(AuthCommand.UPDATE, new { token = refreshToken });
            }
        }

        public async void AsyncCachedSetAdd(string setName, string value) 
        {
            await _cache.SetAddAsync(setName, value);
        }

        private void SetRefreshCache(string refreshToken)
        {
            dynamic sqlResult;
            string key = refreshToken.Substring(0, 10);

            IList<HashEntry> newCache = new List<HashEntry>();

            using (_sqlConnection)
            {
                // TODO: Query all refreshTokens
                sqlResult = _sqlConnection.Query(AuthCommand.SELECT, new { token = refreshToken })
                    .FirstOrDefault();
            }
            
            // Iterate over each key of result object and add value to list for cache
            foreach (var kvp in (IDictionary<string, object>)sqlResult)
            {
                if (kvp.Key == "Expires") continue;
                newCache.Add(new HashEntry(kvp.Key, kvp.Value.ToString()));
            }

            // Add to cache with TTL set to remaining time left of token
            _cache.HashSet(key, newCache.ToArray<HashEntry>());
            _cache.KeyExpire(key, ((DateTime)sqlResult.Expires).Subtract(DateTime.Now));
        }
    }
}
