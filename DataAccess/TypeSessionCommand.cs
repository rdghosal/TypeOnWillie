using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.DataAccess
{
    public static class TypeSessionCommand
    {
        public const string INSERT = @"INSERT INTO [type_on_willie].[dbo].[TypeSessions] 
                                       (UserId, SonnetId, SecondsElapsed, CorrectWordCount, TypedWordCount, MisspelledWordCount, Quit, TouchScreen)
                                       VALUES (@userId, @sonnetId, @secondsElapsed, @correctWordCount, @typedWordCount, @misspelledWordCount, @quit, @touchScreen);";

        public const string SELECT = @"SELECT Id
                                       FROM [type_on_willie].[dbo].[TypeSessions]
                                       WHERE DateTime = (SELECT MAX(DateTime) 
                                                         FROM [type_on_willie].[dbo].[TypeSessions]
                                                         WHERE UserId = @userId);";

        public const string SELECT_ALL = @"SELECT [SecondsElapsed], [PercentCorrect], [MisspelledWords] 
                                           FROM [type_on_willie].[dbo].[TypeSessions]
                                           WHERE [UserId] = @userId;";
        public const string SELECT_SCORES_LASTYEAR = @"SELECT 
                                                        MONTH([DateTime]) AS 'Month', 
                                                        AVG([TypedWordCount]/[SecondsElapsed] * 60) AS 'AverageWpm',
                                                        AVG([CorrectWordCount]*1.0 / [TypedWordCount]*1.0) AS 'AverageAccuracy'
                                                     FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                     WHERE ts.UserId = @userId,
                                                        AND ts.Quit = 'N',
                                                        AND ts.DateTime BETWEEN GETDATE() AND DATEADD(year, -1, GETDATE())
                                                     GROUP BY MONTH([DateTime]);";
        public const string SELECT_SCORES_BYMONTH = @"SELECT
                                                        DAY([DateTime]) AS 'Day',
                                                        AVG([TypedWordCount]/[SecondsElapsed] * 60) AS 'AverageWpm',
                                                        AVG([CorrectWordCount]*1.0 / [TypedWordCount]*1.0) AS 'AverageAccuracy'
                                                     FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                     WHERE ts.UserId = @userId,
                                                        AND ts.Quit = 'N',
                                                        AND MONTH(ts.DateTime) = @month
                                                     GROUP BY DAY([DateTime]);";
        public const string SELECT_TOP_SCORES = @"SELECT
                                                    (SELECT 
                                                        [SonnetId]
                                                     FROM [type_on_willie].[dbo].[TypeSessions] ts,
                                                     WHERE ts.UserId = @userId
                                                     GROUP BY [SonnetId]
                                                     HAVING MAX(COUNT([SonnetId])) AS 'TopSonnet',
                                                    (SELECT 
                                                        MAX([TypedWordCount]/[SecondsElapsed] * 60)
                                                     FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                     WHERE ts.UserId = @userId
                                                        AND ts.Quit = 'N') AS 'TopWpm',
                                                    (SELECT
                                                        MAX([CorrectWordCount]*1.0 / [TypedWordCount]*1.0)
                                                    FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                    WHERE ts.UserId = @userId
                                                        AND ts.Quit = 'N') AS 'TopAccuracy'
                                                FROM [type_on_willie].[dbo].[TypeSessions];";
    }
}
