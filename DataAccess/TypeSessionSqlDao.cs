using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;

namespace TypeOnWillie.DataAccess
{
    public class TypeSessionSqlDao : SqlDao
    {
        public TypeSessionSqlDao(SqlConnection sqlConnection) : base(sqlConnection)
        {
        }
        public int InsertTypeSession(TypeSession typeSession)
        {
            using (_sqlConnection)
            {
                _sqlConnection.Open();
                return _sqlConnection.Execute(TypeSessionCommand.SELECT_ALL, new {
                    userId = typeSession.UserId,
                    sonnetId = typeSession.SonnetId,
                    secondsElapsed = typeSession.SecondsElapsed,
                    percentCorrect = typeSession.PercentCorrect,
                    misspelledWords = typeSession.MisspelledWords
                });
            }
        }
        public IEnumerable<TypeSession> SelectTypeSessions(UserDto userDto)
        {
            using (_sqlConnection)
            {
                _sqlConnection.Open();
                return _sqlConnection.Query<TypeSession>(TypeSessionCommand.INSERT, new { userId = userDto.Id });
            }
        }
    }
}
