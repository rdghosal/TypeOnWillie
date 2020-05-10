using Newtonsoft.Json.Serialization;
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
                                                        AVG([TypedWordCount]/[SecondsElapsed] * 60.0) AS 'AverageWpm',
                                                        AVG([CorrectWordCount]*1.0 / [TypedWordCount]*1.0) AS 'AverageAccuracy'
                                                     FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                     WHERE ts.UserId = @userId,
                                                        AND ts.Quit = 'N',
                                                        AND MONTH(ts.DateTime) = @month
                                                     GROUP BY DAY([DateTime]);";
        public const string SELECT_TOP_SCORES = @"SELECT
                                                    (SELECT [Id]
                                                        , [FileName] 
                                                    FROM [type_on_willie].[dbo].[Sonnets] 
                                                    WHERE [Id] = 
                                                        (SELECT [SonnetId]
                                                        FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE ts.UserId = @userId
                                                        GROUP BY [SonnetId]
                                                        HAVING COUNT([SonnetId]) = 
                                                            (SELECT 
                                                                MAX(c)
                                                            FROM 
                                                                (SELECT COUNT([SonnetId]) AS 'c'
                                                                FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                                WHERE ts.UserId = @userId
                                                                GROUP BY [SonnetId]) T)))) AS 'FavoriteSonnet',
                                                    (SELECT 
                                                        MAX([TypedWordCount]/[SecondsElapsed] * 60)
                                                    FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                    WHERE ts.UserId = @userId
                                                        AND ts.Quit = 'N') AS 'TopWpm',
                                                    (SELECT
                                                        MAX([CorrectWordCount]*1.0 / [TypedWordCount]*1.0)
                                                    FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                    WHERE ts.UserId = @userId
                                                        AND ts.Quit = 'N') AS 'TopAccuracy',
                                                    (SELECT
                                                        MIN([SecondsElapsed])
                                                    FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                    WHERE ts.UserId = @userId
                                                        AND ts.Quit = 'N') AS 'TopTime'
                                                FROM [type_on_willie].[dbo].[TypeSessions];";

        public const string SELECT_USER_METRICS = @"SELECT 
                                                        AVG([CorrectWordCount] * 1.0 / [TypedWordCount] * 1.0) AS 'AverageAccuracy'
                                                        , AVG([TypedWordCount] / [SecondsElapsed] * 60.0) AS 'AverageWpm'
                                                        , AVG([SecondsElapsed] * 1.0) AS 'AverageTime',
                                                        , T1.Punctuation
                                                        , T2.CapitalLetters
                                                    FROM 
                                                        (SELECT 
                                                            AVG([PunctuationCount]-COUNT([TypeSessionId])/[PunctuationCount]) AS 'Punctuation',
                                                        FROM 
                                                            [type_on_willie].[dbo].[TypeSessions] ts
                                                        INNER JOIN
                                                            [type_on_willie].[dbo].[Sonnets] s
                                                            ON ts.SonnetId = s.Id
                                                        WHERE
                                                            ts.UserId = @userId
                                                            AND ts.Quit = 'N'
                                                            AND ts.ModelWord LIKE '%[-,.;:!?\""\''\]\[]$%'
                                                        GROUP BY
                                                            ts.Id) T1,
                                                        (SELECT
                                                            AVG([CapitalLetterCount]-COUNT([TypeSessionId])/[CapitalLetterCount]) AS 'CapitalLetters',
                                                        FROM 
                                                            [type_on_willie].[dbo].[TypeSessions] ts
                                                        INNER JOIN
                                                            [type_on_willie].[dbo].[Sonnets] s
                                                            ON ts.SonnetId = s.Id
                                                        WHERE
                                                            ts.UserId = @userId
                                                            AND ts.Quit = 'N'
                                                            AND ts.ModelWord LIKE '%[A-Z]%'
                                                        GROUP BY
                                                            ts.Id) T2,
                                                        [type_on_willie].[dbo].[TypeSessions]
                                                    WHERE 
                                                        ts.User = @userId
                                                        AND ts.Quit = 'N'";
    }
}
