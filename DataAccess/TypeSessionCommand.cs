using Microsoft.AspNetCore.Routing;
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

        public const string SELECT_ALL_SONNETS = @"SELECT
                                                    DISTINCT [SonnetId]
                                                 FROM 
                                                    [type_on_willie].[dbo].[TypeSessions]
                                                 WHERE
                                                    UserId = @userId;";

        public const string SELECT_TOP_SONNET = @"SELECT
                                                    TOP 1 [SonnetId]
                                                FROM
                                                    [type_on_willie].[dbo].[TypeSessions]
                                                GROUP BY 
                                                    [SonnetId]
                                                ORDER BY
                                                    COUNT([SonnetId]) DESC;";

        public const string SELECT_SCORES_LASTYEAR = @"SELECT 
                                                        MONTH([DateTime]) AS 'Month', 
                                                        AVG([SecondsElapsed]) AS 'AverageTime',
                                                        AVG([TypedWordCount]*60 / [SecondsElapsed]) AS 'AverageWpm',
                                                        AVG([CorrectWordCount]*1.0 / [TypedWordCount]*1.0) AS 'AverageAccuracy'
                                                     FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                     WHERE ts.UserId = @userId
                                                        AND ts.Quit = 'N'
                                                        AND ts.DateTime BETWEEN DATEADD(year, -1, @endDate) AND @endDate
                                                     GROUP BY MONTH([DateTime]);";

        public const string SELECT_SCORES_BYMONTH = @"SELECT
                                                        DAY([DateTime]) AS 'Day',
                                                        AVG([SecondsElapsed]) AS 'AverageTime',
                                                        AVG([TypedWordCount]*60 / [SecondsElapsed]) AS 'AverageWpm',
                                                        AVG([CorrectWordCount]*1.0 / [TypedWordCount]*1.0) AS 'AverageAccuracy'
                                                     FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                     WHERE ts.UserId = @userId
                                                        AND ts.Quit = 'N'
                                                        AND MONTH(ts.DateTime) = @month
                                                        AND YEAR(ts.DateTime) = @year
                                                     GROUP BY DAY([DateTime]);";

        public const string SELECT_SCORES_LASTYEAR_ALL = @"SELECT 
                                                        MONTH([DateTime]) AS 'Month', 
                                                        AVG([SecondsElapsed]) AS 'AverageTime',
                                                        AVG([TypedWordCount]*60 / [SecondsElapsed]) AS 'AverageWpm',
                                                        AVG([CorrectWordCount]*1.0 / [TypedWordCount]*1.0) AS 'AverageAccuracy'
                                                     FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                     WHERE ts.Quit = 'N'
                                                        AND ts.DateTime BETWEEN DATEADD(year, -1, @endDate) AND @endDate
                                                     GROUP BY MONTH([DateTime]);";

        public const string SELECT_SCORES_BYMONTH_ALL = @"SELECT
                                                        DAY([DateTime]) AS 'Day',
                                                        AVG([SecondsElapsed]) AS 'AverageTime',
                                                        AVG([TypedWordCount]*60 / [SecondsElapsed]) AS 'AverageWpm',
                                                        AVG([CorrectWordCount]*1.0 / [TypedWordCount]*1.0) AS 'AverageAccuracy'
                                                     FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                     WHERE ts.Quit = 'N'
                                                        AND MONTH(ts.DateTime) = @month
                                                        AND YEAR(ts.DateTime) = @year
                                                     GROUP BY DAY([DateTime]);";

        public const string SELECT_TOP_SCORES = @"SELECT DISTINCT
                                                    (SELECT [Id]
                                                    FROM [type_on_willie].[dbo].[Sonnets] 
                                                    WHERE [Id] = 
                                                        (SELECT TOP 1 [SonnetId]
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
                                                                GROUP BY [SonnetId]) T))) AS 'FavoriteSonnet',
                                                    (SELECT 
                                                        MAX([TypedWordCount]*60 / [SecondsElapsed])
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

        public const string SELECT_ALL_METRICS = @"SELECT 
                                                        T1.AverageAccuracy
                                                        , T1.AverageWpm
                                                        , T1.AverageTime
                                                        , T3.Punctuation
                                                        , T5.CapitalLetters
                                                    FROM
                                                        (SELECT 
                                                            AVG([CorrectWordCount] * 1.0 / [TypedWordCount] * 1.0) AS 'AverageAccuracy',
                                                            AVG([TypedWordCount] * 1.0 / [SecondsElapsed] * 60.0) AS 'AverageWpm',
                                                            AVG([SecondsElapsed] * 1.0) AS 'AverageTime'
                                                        FROM
                                                            [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE ts.Quit = 'N') T1,
                                                        (SELECT 
                                                            AVG(([PunctuationCount] - ms_count) * 1.0 /[PunctuationCount] * 1.0) AS 'Punctuation'
                                                        FROM
                                                            [type_on_willie].[dbo].[TypeSessions] ts,
                                                            [type_on_willie].[dbo].[Sonnets] s,
                                                            (SELECT 
                                                                COUNT(ts.SonnetId) AS 'ms_count'
                                                            FROM
                                                                [type_on_willie].[dbo].[TypeSessions] ts
                                                            INNER JOIN
                                                                [type_on_willie].[dbo].[Misspellings] m
                                                                ON ts.Id = m.TypeSessionId
                                                            WHERE m.ModelWord LIKE '%[,.:;!?-""''\[\]]%' ESCAPE '\'
                                                            GROUP BY ts.Id) T2
                                                        WHERE ts.SonnetId = s.Id) T3,	
                                                    (SELECT
                                                        AVG(([CapitalLetterCount]-cap_count) * 1.0/[CapitalLetterCount]) AS 'CapitalLetters'
                                                    FROM 
                                                        [type_on_willie].[dbo].[TypeSessions] ts,
                                                        [type_on_willie].[dbo].[Sonnets] s,
                                                        (SELECT 
                                                                COUNT(ts.Id) AS 'cap_count'
                                                            FROM
                                                                [type_on_willie].[dbo].[TypeSessions] ts
                                                            INNER JOIN
                                                                [type_on_willie].[dbo].[Misspellings] m
                                                                ON ts.Id = m.TypeSessionId
                                                            WHERE 
                                                                m.ModelWord COLLATE Latin1_General_Bin LIKE '%[A-Z]%'
                                                            GROUP BY ts.Id) T4
                                                    WHERE ts.SonnetId = s.Id) T5";

        public const string SELECT_USER_METRICS = @"SELECT 
                                                        T1.AverageAccuracy
                                                        , T1.AverageWpm
                                                        , T1.AverageTime
                                                        , T3.Punctuation
                                                        , T5.CapitalLetters
                                                    FROM
                                                        (SELECT 
                                                            AVG([CorrectWordCount] * 1.0 / [TypedWordCount] * 1.0) AS 'AverageAccuracy',
                                                            AVG([TypedWordCount] * 1.0 / [SecondsElapsed] * 60.0) AS 'AverageWpm',
                                                            AVG([SecondsElapsed] * 1.0) AS 'AverageTime'
                                                        FROM
                                                            [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE
                                                            ts.UserId = @userId
                                                            AND ts.Quit = 'N') T1,
                                                        (SELECT 
                                                            AVG(([PunctuationCount] - ms_count) * 1.0 /[PunctuationCount] * 1.0) AS 'Punctuation'
                                                        FROM
                                                            [type_on_willie].[dbo].[TypeSessions] ts,
                                                            [type_on_willie].[dbo].[Sonnets] s,
                                                            (SELECT 
                                                                COUNT(ts.SonnetId) AS 'ms_count'
                                                            FROM
                                                                [type_on_willie].[dbo].[TypeSessions] ts
                                                            INNER JOIN
                                                                [type_on_willie].[dbo].[Misspellings] m
                                                                ON ts.Id = m.TypeSessionId
                                                            WHERE 
                                                                ts.UserId = @userId
                                                                AND m.ModelWord LIKE '%[,.:;!?-""''\[\]]%' ESCAPE '\'
                                                            GROUP BY ts.Id) T2
                                                        WHERE ts.SonnetId = s.Id) T3,	
                                                    (SELECT
                                                        AVG(([CapitalLetterCount]-cap_count) * 1.0/[CapitalLetterCount]) AS 'CapitalLetters'
                                                    FROM 
                                                        [type_on_willie].[dbo].[TypeSessions] ts,
                                                        [type_on_willie].[dbo].[Sonnets] s,
                                                        (SELECT 
                                                                COUNT(ts.Id) AS 'cap_count'
                                                            FROM
                                                                [type_on_willie].[dbo].[TypeSessions] ts
                                                            INNER JOIN
                                                                [type_on_willie].[dbo].[Misspellings] m
                                                                ON ts.Id = m.TypeSessionId
                                                            WHERE 
                                                                ts.UserId = @userId
                                                                AND m.ModelWord COLLATE Latin1_General_Bin LIKE '%[A-Z]%'
                                                            GROUP BY ts.Id) T4
                                                    WHERE ts.SonnetId = s.Id) T5";
    }
}
