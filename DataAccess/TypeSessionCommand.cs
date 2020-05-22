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
                                                        YEAR([DateTime]) AS 'Year', 
                                                        AVG([SecondsElapsed]) AS 'AverageTime',
                                                        AVG([TypedWordCount]*60 / [SecondsElapsed]) AS 'AverageWpm',
                                                        AVG([CorrectWordCount]*1.0 / [TypedWordCount]*1.0) AS 'AverageAccuracy'
                                                     FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                     WHERE ts.UserId = @userId
                                                        AND ts.Quit = 'N'
                                                        AND ts.DateTime BETWEEN DATEADD(year, -2, @endDate) AND @endDate
                                                     GROUP BY YEAR([DateTime]), MONTH([DateTime])
                                                     ORDER BY YEAR([DateTime]), MONTH([DateTime]);";

        public const string SELECT_SCORES_BYMONTH = @"SELECT
                                                        DAY([DateTime]) AS 'Day',
                                                        MONTH([DateTime]) AS 'Month',
                                                        YEAR([DateTime]) AS 'Year',
                                                        AVG([SecondsElapsed]) AS 'AverageTime',
                                                        AVG([TypedWordCount]*60.0 / [SecondsElapsed]) AS 'AverageWpm',
                                                        AVG([CorrectWordCount]*1.0 / [TypedWordCount]*1.0) AS 'AverageAccuracy'
                                                     FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                     WHERE ts.UserId = @userId
                                                        AND ts.Quit = 'N'
                                                        AND MONTH(ts.DateTime) = MONTH(@endDate)
                                                        AND YEAR(ts.DateTime) = YEAR(@endDate)
                                                     GROUP BY YEAR([DateTime]), MONTH([DateTime]), DAY([DateTime])
                                                     ORDER BY YEAR([DateTime]), MONTH([DateTime]), DAY([DateTime]);";

        public const string SELECT_SCORES_LASTYEAR_ALL = @"SELECT 
                                                        MONTH([DateTime]) AS 'Month', 
                                                        YEAR([DateTime]) AS 'Year', 
                                                        AVG([SecondsElapsed]) AS 'AverageTime',
                                                        AVG([TypedWordCount]*60.0 / [SecondsElapsed]) AS 'AverageWpm',
                                                        AVG([CorrectWordCount]*1.0 / [TypedWordCount]*1.0) AS 'AverageAccuracy'
                                                     FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                     WHERE ts.Quit = 'N'
                                                        AND ts.DateTime BETWEEN DATEADD(year, -1, @endDate) AND @endDate
                                                     GROUP BY YEAR([DateTime]), MONTH([DateTime])
                                                     GROUP BY YEAR([DateTime]), MONTH([DateTime]);";

        public const string SELECT_SCORES_BYMONTH_ALL = @"SELECT
                                                        DAY([DateTime]) AS 'Day',
                                                        MONTH([DateTime]) AS 'Month',
                                                        YEAR([DateTime]) AS 'Year',
                                                        AVG([SecondsElapsed]) AS 'AverageTime',
                                                        AVG([TypedWordCount]*60.0 / [SecondsElapsed]) AS 'AverageWpm',
                                                        AVG([CorrectWordCount]*1.0 / [TypedWordCount]*1.0) AS 'AverageAccuracy'
                                                     FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                     WHERE ts.Quit = 'N'
                                                        AND MONTH(ts.DateTime) = MONTH(@endDate)
                                                        AND YEAR(ts.DateTime) = YEAR(@endDate)
                                                     GROUP BY YEAR([DateTime]), MONTH([DateTime]), DAY([DateTime])
                                                     ORDER BY YEAR([DateTime]), MONTH([DateTime]), DAY([DateTime]);";

        public const string SELECT_USER_RECORDS = @"SELECT DISTINCT
                                                        (SELECT TOP 1 
                                                            SonnetId
                                                        FROM 
                                                            [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE
                                                            ts.UserId = @userId
                                                            AND ts.Quit = 'N'
                                                        GROUP BY 
                                                            [SonnetId]
                                                        ORDER BY 
                                                            AVG([CorrectWordCount] * 1.0/[TypedWordCount]) DESC) AS 'BestAccuracySonnet',
                                                        (SELECT TOP 1 
                                                            SonnetId
                                                        FROM 
                                                            [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE
                                                            ts.UserId = @userId
                                                            AND ts.Quit = 'N'
                                                        GROUP BY 
                                                            [SonnetId]
                                                        ORDER BY 
                                                            AVG([CorrectWordCount] * 1.0/[TypedWordCount]) ASC) AS 'WorstAccuracySonnet',
                                                        (SELECT TOP 1 
                                                            SonnetId
                                                        FROM 
                                                            [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE
                                                            ts.UserId = @userId
                                                            AND ts.Quit = 'N'
                                                        GROUP BY 
                                                            [SonnetId]
                                                        ORDER BY 
                                                            AVG(SecondsElapsed * 1.0) ASC) AS 'BestTimeSonnet',
                                                        (SELECT TOP 1 
                                                            SonnetId
                                                        FROM 
                                                            [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE
                                                            ts.UserId = @userId
                                                            AND ts.Quit = 'N'
                                                        GROUP BY 
                                                            [SonnetId]
                                                        ORDER BY 
                                                            AVG(SecondsElapsed * 1.0) DESC) AS 'WorstTimeSonnet',
                                                        (SELECT TOP 1 
                                                            SonnetId
                                                        FROM 
                                                            [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE
                                                            ts.UserId = @userId
                                                            AND ts.Quit = 'N'
                                                        GROUP BY 
                                                            [SonnetId]
                                                        ORDER BY 
                                                            AVG([TypedWordCount]/[SecondsElapsed] * 60.0) ASC) AS 'BestWpmSonnet',
                                                        (SELECT TOP 1
                                                            SonnetId
                                                        FROM 
                                                            [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE
                                                            ts.UserId = @userId
                                                            AND ts.Quit = 'N'
                                                        GROUP BY 
                                                            [SonnetId]
                                                        ORDER BY 
                                                            AVG([TypedWordCount]/[SecondsElapsed] * 60.0) DESC) AS 'WorstWpmSonnet',
                                                        (SELECT 
                                                            MAX([TypedWordCount]*60.0 / [SecondsElapsed])
                                                        FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE ts.UserId = @userId
                                                            AND ts.Quit = 'N') AS 'BestWpm',
                                                        (SELECT 
                                                            MIN([TypedWordCount]*60.0 / [SecondsElapsed])
                                                        FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE ts.UserId = @userId
                                                            AND ts.Quit = 'N') AS 'WorstWpm',
                                                        (SELECT
                                                            MAX([CorrectWordCount]*1.0 / [TypedWordCount]*1.0)
                                                        FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE ts.UserId = @userId
                                                            AND ts.Quit = 'N') AS 'BestAccuracy',
                                                        (SELECT
                                                            MIN([CorrectWordCount]*1.0 / [TypedWordCount]*1.0)
                                                        FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE ts.UserId = @userId
                                                            AND ts.Quit = 'N') AS 'WorstAccuracy',
                                                        (SELECT
                                                            MIN([SecondsElapsed])
                                                        FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE ts.UserId = @userId
                                                            AND ts.Quit = 'N') AS 'BestTime',
                                                        (SELECT
                                                            MAX([SecondsElapsed])
                                                        FROM [type_on_willie].[dbo].[TypeSessions] ts
                                                        WHERE ts.UserId = @userId
                                                            AND ts.Quit = 'N') AS 'WorstTime'
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

		public const string SELECT_USER_PERCENTILES = @"SELECT 
                                                        AccuracyPercentile
                                                        , TimePercentile
                                                        , WpmPercentile
                                                        , CapitalLetterPercentile
                                                        , PunctuationPercentile
                                                    FROM 
                                                        (SELECT 
                                                            lt_cnt * 1.0 / a * 1.0 AS 'AccuracyPercentile'
                                                        FROM 
                                                            (SELECT 
                                                                COUNT(lt) AS 'lt_cnt'
                                                            FROM 
                                                                (SELECT DISTINCT 
                                                                    userid AS 'lt'
                                                                FROM 
                                                                    type_on_willie.dbo.TypeSessions ts
                                                                WHERE 
                                                                    quit = 'N'
                                                                    AND UserID <> @userId
                                                                GROUP BY 
                                                                    UserID
                                                                HAVING 
                                                                    AVG(CorrectWordCount * 1.0 / TypedWordCount) < 
                                                                        (SELECT 
                                                                            AVG(CorrectWordCount * 1.0/TypedWordCount)
                                                                        FROM 
                                                                            type_on_willie.dbo.TypeSessions ts
                                                                        WHERE 
                                                                            userid = @userId
                                                                        AND quit = 'N')) T) T2,
                                                                (SELECT 
                                                                    COUNT(DISTINCT userid) As 'a'
                                                                FROM 
                                                                    type_on_willie.dbo.TypeSessions ts
                                                                WHERE 
                                                                    quit = 'N') T3) A,
                                                        (SELECT 
                                                            lt_cnt * 1.0 / a * 1.0 AS 'TimePercentile'
                                                        FROM 
                                                            (SELECT 
                                                                COUNT(lt) AS 'lt_cnt'
                                                            FROM 
                                                                (SELECT DISTINCT 
                                                                    userid AS 'lt'
                                                                FROM 
                                                                    type_on_willie.dbo.TypeSessions ts
                                                                WHERE 
                                                                    quit = 'N'
                                                                    AND UserID <> @userId
                                                                GROUP BY 
                                                                    UserID
                                                                HAVING
                                                                    AVG(SecondsElapsed * 1.0) < 
                                                                        (SELECT 
                                                                            AVG(SecondsElapsed * 1.0)
                                                                        FROM 
                                                                            type_on_willie.dbo.TypeSessions ts
                                                                        WHERE 
                                                                            userid = @userId
                                                                        AND 
                                                                            quit = 'N')) T) T2,
                                                                (SELECT 
                                                                    COUNT(DISTINCT userid) As 'a'
                                                                FROM 
                                                                    type_on_willie.dbo.TypeSessions ts
                                                                WHERE 
                                                                    quit = 'N') T3) B,
                                                        (SELECT 
                                                            lt_cnt * 1.0 / a * 1.0 AS 'WpmPercentile'
                                                        FROM 
                                                            (SELECT 
                                                                COUNT(lt) AS 'lt_cnt' 
                                                            FROM 
                                                                (SELECT DISTINCT 
                                                                    userid AS 'lt'
                                                                FROM 
                                                                    type_on_willie.dbo.TypeSessions ts
                                                                WHERE 
                                                                    quit = 'N'
                                                                    AND UserID <> @userId
                                                                GROUP 
                                                                    BY UserID
                                                                HAVING 
                                                                    AVG(TypedWordCount/SecondsElapsed * 60.0) < 
                                                                        (SELECT 
                                                                            AVG(TypedWordCount/SecondsElapsed * 60.0)
                                                                        FROM 
                                                                            type_on_willie.dbo.TypeSessions ts
                                                                        WHERE 
                                                                            userid = @userId
                                                                            AND quit = 'N')) T) T2,
                                                                (SELECT 
                                                                    COUNT(DISTINCT userid) As 'a'
                                                                FROM 
                                                                    type_on_willie.dbo.TypeSessions ts
                                                                WHERE 
                                                                    quit = 'N') T3) C,
                                                    (SELECT 
                                                            lt_cnt * 1.0 / a * 1.0 AS 'PunctuationPercentile'
                                                        FROM 
                                                            (SELECT 
                                                                COUNT(lt) AS 'lt_cnt'
                                                            FROM 
                                                                (SELECT DISTINCT 
                                                                    userid AS 'lt'
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
                                                                WHERE ts.SonnetId = s.Id
                                                                    AND ts.quit = 'N'
                                                                    AND UserID <> @userId
                                                                GROUP BY 
                                                                    UserID
                                                                HAVING
                                                                    AVG(([PunctuationCount] - ms_count) * 1.0 /[PunctuationCount] * 1.0) >
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
                                                                        WHERE ts.SonnetId = s.Id)) T3) T4,
                                                                (SELECT 
                                                                    COUNT(DISTINCT userid) As 'a'
                                                                FROM 
                                                                    type_on_willie.dbo.TypeSessions ts
                                                                WHERE 
                                                                    quit = 'N') T5) D,
                                                    (SELECT 
                                                            lt_cnt * 1.0 / a * 1.0 AS 'CapitalLetterPercentile'
                                                        FROM 
                                                            (SELECT 
                                                                COUNT(lt) AS 'lt_cnt'
                                                            FROM 
                                                                (SELECT DISTINCT 
                                                                    userid AS 'lt'
                                                                FROM
                                                                    [type_on_willie].[dbo].[TypeSessions] ts,
                                                                    [type_on_willie].[dbo].[Sonnets] s,
                                                                    (SELECT
                                                                        COUNT(ts.SonnetId) AS 'cap_count'
                                                                    FROM
                                                                        [type_on_willie].[dbo].[TypeSessions] ts
                                                                    INNER JOIN
                                                                        [type_on_willie].[dbo].[Misspellings] m
                                                                        ON ts.Id = m.TypeSessionId
                                                                    WHERE
                                                                        ts.UserId = @userId
                                                                        AND m.ModelWord COLLATE Latin1_General_Bin LIKE '%[A-Z]%'
                                                                    GROUP BY ts.Id) T2
                                                                WHERE ts.SonnetId = s.Id
                                                                    AND ts.quit = 'N'
                                                                    AND UserID <> @userId
                                                                GROUP BY 
                                                                    UserID
                                                                HAVING
                                                                    AVG(([PunctuationCount] - cap_count) * 1.0 /[PunctuationCount] * 1.0) >
                                                                        (SELECT
                                                                            AVG(([PunctuationCount] - ms_count) * 1.0 /[PunctuationCount] * 1.0)
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
                                                                                AND m.ModelWord COLLATE Latin1_General_Bin LIKE '%[A-Z]%'
                                                                            GROUP BY ts.Id) T2
                                                                        WHERE ts.SonnetId = s.Id)) T3) T4,
                                                                (SELECT 
                                                                    COUNT(DISTINCT userid) As 'a'
                                                                FROM 
                                                                    type_on_willie.dbo.TypeSessions ts
                                                                WHERE 
                                                                    quit = 'N') T5) E;";

        }
    }
