using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.DataAccess
{
    public static class TypeSessionCommand
    {
        public const string INSERT = @"INSERT INTO [type_on_willie].[dbo].[TypeSessions] (UserId, SonnetId, SecondsElapsed, CorrectWordCount, TypedWordCount, MisspelledWords, MisspelledWordCount, Quit, TouchScreen)
                                       VALUES (@userId, @sonnetId, @secondsElapsed, @correctWordCount, @typedWordCount, @misspelledWords, @misspelledWordCount, @quit, @touchScreen);";
        public const string SELECT_ALL = @"SELECT [SecondsElapsed], [PercentCorrect], [MisspelledWords] FROM [type_on_willie].[dbo].[TypeSessions]
                                           WHERE [UserId] = @userId;";
    }
}
