using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.DataAccess
{
    public static class TypeSessionCommand
    {
        public const string INSERT = @"INSERT INTO [type_on_willie].[dbo].[TypeSessions] (UserId, SonnetId, SecondsElapsed, PercentCorrect, PercentFinished, MisspelledWords, NumberMisspelled, Quit, TouchScreen)
                                       VALUES (@userId, @sonnetId, @secondsElapsed, @percentCorrect, @percentFinished, @misspelledWords, @numberMisspelled, @quit, @touchScreen);";
        public const string SELECT_ALL = @"SELECT [SecondsElapsed], [PercentCorrect], [MisspelledWords] FROM [type_on_willie].[dbo].[TypeSessions]
                                           WHERE [UserId] = @userId;";
    }
}
