using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;
using Dapper;
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.Extensions.Configuration;
using System.Runtime.InteropServices.ComTypes;

namespace TypeOnWillie.DataAccess
{
    public class SonnetSqlDao : SqlDao
    {

        private readonly IConfiguration _config;
        public SonnetSqlDao(SqlConnection sqlConnection, IConfiguration configuration) : base(sqlConnection)
        {
            _config = configuration;
        }

        public IEnumerable<Sonnet> SelectSonnets()
        {
            using (_sqlConnection)
            {
                _sqlConnection.Open();
                return _sqlConnection.Query<Sonnet>(SonnetCommand.SELECT_ALL);
            }
        }

        public IEnumerable<SonnetStatistic> SelectStatisticsAll(SonnetHistoryParams params_)
        {
            IEnumerable<SonnetStatistic> stats;
            using (var sqlConnection = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                stats = sqlConnection.Query<SonnetStatistic>(SonnetCommand.SELECT_STATS_ALL, 
                    new
                    {
                        userId = params_.UserId,
                        sonnetId = params_.SonnetId
                    });
            }

            return stats;
        }

        public IEnumerable<Misspelling> SelectMisspellingsAll(SonnetHistoryParams params_)
        {
            IEnumerable<Misspelling> misspellings;
            using (var sqlConnection = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                misspellings = sqlConnection.Query<Misspelling>(SonnetCommand.SELECT_MISSPELLINGS_ALL, 
                    new
                    {
                        userId = params_.UserId,
                        sonnetId = params_.SonnetId
                    });
            }

            return misspellings;
        }

        public IEnumerable<Sonnet> SelectSonnets(SonnetParams params_)
        {
            IEnumerable<Sonnet> sonnets;
            using (var sqlConnection = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                // TODO: Add guest logic
                sonnets = sqlConnection.Query<Sonnet>(
                    SonnetCommand.SELECT_SONNETS_BYUSER,
                    new
                    {
                        userId = params_.UserId

                    });
            }

            return sonnets;
        }
    }
}
