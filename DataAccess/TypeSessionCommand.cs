﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.DataAccess
{
    public static class TypeSessionCommand
    {
        public const string INSERT = @"INSERT INTO [type_on_willie].[dbo].[TypeSessions] (DateTime, UserId, SonnetId, SecondsElapsed, CorrectWordCount, TypedWordCount, MisspelledWordCount, Quit, TouchScreen)
                                       VALUES (@dateTime, @userId, @sonnetId, @secondsElapsed, @correctWordCount, @typedWordCount, @misspelledWordCount, @quit, @touchScreen);";

        public const string SELECT = @"SELECT Id
                                       FROM [type_on_willie].[dbo].[TypeSessions]
                                       WHERE DateTime = (SELECT MAX(DateTime) 
                                                         FROM [type_on_willie].[dbo].[TypeSessions]);";

        public const string SELECT_ALL = @"SELECT [SecondsElapsed], [PercentCorrect], [MisspelledWords] FROM [type_on_willie].[dbo].[TypeSessions]
                                           WHERE [UserId] = @userId;";
    }
}
