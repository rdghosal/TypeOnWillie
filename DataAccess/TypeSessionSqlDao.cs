using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;

namespace TypeOnWillie.DataAccess
{
    public class TypeSessionSqlDao : SqlDao
    {

        private readonly IConfiguration _config;

        public TypeSessionSqlDao(SqlConnection sqlConnection, IConfiguration config) : base(sqlConnection)
        {
            _config = config;
        }

        public int InsertTypeSession(TypeSession typeSession)
        {
            using (var _sqlConnection = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                _sqlConnection.Open();
                return _sqlConnection.Execute(TypeSessionCommand.INSERT, new
                {
                    userId = typeSession.UserId,
                    sonnetId = typeSession.SonnetId,
                    secondsElapsed = typeSession.SecondsElapsed,
                    correctWordCount = typeSession.CorrectWordCount,
                    typedWordCount = typeSession.TypedWordCount,
                    misspelledWords = typeSession.MisspelledWords,
                    misspelledWordCount = typeSession.MisspelledWordCount,
                    quit = typeSession.Quit,
                    touchScreen = typeSession.TouchScreen
                });
            }
        }

        public IEnumerable<TypeSession> SelectTypeSessions(UserDto userDto)
        {
            using (_sqlConnection)
            {
                _sqlConnection.Open();
                return _sqlConnection.Query<TypeSession>(TypeSessionCommand.SELECT_ALL, new { userId = userDto.Id });
            }
        }
    }
}
