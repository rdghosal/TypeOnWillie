using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.DataAccess
{
    public static class ScoreCommand
    {
        public const string INSERT = @"INSERT INTO [type_on_willie].[Scores] (UserId, SonnetId, DateTime, SuccessRate, Misspellings)
                                       VALUES (@userId, @sonnetID, CURRENT_TIMESTAMP, @successRate, @misspellings);";
        public const string SELECT_ALL = @"SELECT [SuccessRate], [Misspellings] FROM [type_on_willie].[Scores]
                                           WHERE [UserId] = @userId;";
    }
}
