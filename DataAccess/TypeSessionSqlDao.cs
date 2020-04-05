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
                    misspelledWordCount = typeSession.MisspelledWordCount,
                    quit = typeSession.Quit,
                    touchScreen = typeSession.TouchScreen
                });
            }
        }

        public void InsertWordTuples(TypeSession typeSession)
        {
            List<WordTuple> wordTuples = typeSession.MisspelledWords;
            using (var _sqlConnection = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                _sqlConnection.Open();

                // Iterate over each List of WordTuples and INSERT
                foreach (WordTuple wt in wordTuples)
                {
                    // Find latest TypeSession.Id
                    var result = _sqlConnection.Query<TypeSession>(TypeSessionCommand.SELECT, new { 
                        userId = typeSession.UserId
                    }).FirstOrDefault();

                    _sqlConnection.Execute(MisspellingCommand.INSERT, new
                    {
                        typeSessionId = result.Id,
                        lineNumber = wt.LineNumber,
                        index = wt.LineNumber,
                        modelWord = wt.ModelWord,
                        typedWord = wt.TypedWord
                    });
                }

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
