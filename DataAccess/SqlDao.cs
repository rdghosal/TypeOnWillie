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
    public class SqlDao
    {
        private readonly string _connectionName;
        public SqlDao(string connectionName)
        {
            _connectionName = connectionName;
        }
        public string GetConnectionString()
        {
            return Environment.GetEnvironmentVariable(_connectionName.ToUpper());
        }
        public SqlConnection GetConnection()
        {
            return new SqlConnection(GetConnectionString());
        }
        public IEnumerable<Sonnet> LoadSonnets()
        {
            string sql = @"SELECT * FROM [type_on_willie].[Sonnets];";
            using SqlConnection sqlConnection = GetConnection();
            return sqlConnection.Query<Sonnet>(sql);
        }
        public User GetUser(User user)
        {
            string sql = @"SELECT UserId FROM [type_on_willie].[Users] 
                           WHERE Username LIKE @username;";
            using SqlConnection sqlConnection = GetConnection();
            return sqlConnection.Query<User>(sql, new { username = user.Username }).FirstOrDefault();
        }
        public int AddUser(User user)
        {
            if (GetUser(user) == null)
            {
                string sql = @"INSERT INTO [type_on_willie].[Users] (Username)
                               VALUES (@username);";
                using SqlConnection sqlConnection = GetConnection();
                return sqlConnection.Execute(sql, new { username = user.Username });
            }
            else
            {
                return -1;
            }
        }
        // TODO Move to Service
        public UserProfile LoadUserProfile(User user)
        {
            string sql = @"SELECT ";
        }
        public int AddScore(Score score)
        {
            string sql = @"INSERT INTO [type_on_willie].[Scores] (UserId, SonnetId, DateTime, SuccessRate, Misspellings)
                           VALUES (@userId, @sonnetID, CURRENT_TIMESTAMP, @successRate, @misspellings);";
            using SqlConnection sqlConnection = GetConnection();
            return sqlConnection.Execute(sql, new { 
                userId = score.UserId, 
                score.SonnetId, 
                successRate = score.SuccessRate, 
                misspellings = string.Join("|", score.Misspellings) 
            });
        }
        public IEnumerable<Score> LoadScores(User user)
        {
            string sql = @"SELECT [SuccessRate], [Misspellings] FROM [type_on_willie].[Scores]
                           WHERE [UserId] = @userId;";
            using SqlConnection sqlConnection = GetConnection();
            return sqlConnection.Query<Score>(sql, new { userId = user.UserId });
        }
    }
}
