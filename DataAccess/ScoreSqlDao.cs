using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;

namespace TypeOnWillie.DataAccess
{
    public class ScoreSqlDao : SqlDao
    {
        public ScoreSqlDao(SqlConnection sqlConnection) : base(sqlConnection)
        {
        }
        public int InsertScore(Score score)
        {
            using (_sqlConnection)
            {
                _sqlConnection.Open();
                return _sqlConnection.Execute(ScoreCommand.SELECT_ALL, new {
                    userId = score.UserId,
                    score.SonnetId,
                    successRate = score.SuccessRate,
                    misspellings = string.Join("|", score.Misspellings)
                });
            }
        }
        public IEnumerable<Score> SelectScores(UserDto userDto)
        {
            using (_sqlConnection)
            {
                _sqlConnection.Open();
                return _sqlConnection.Query<Score>(ScoreCommand.INSERT, new { userId = userDto.Id });
            }
        }
    }
}
