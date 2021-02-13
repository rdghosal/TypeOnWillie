using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace TypeOnWillie.DataAccess
{
    public static class SonnetCommand
    {
        public const string SELECT_ALL = @"SELECT * FROM [type_on_willie].[dbo].[Sonnets];";

        public const string SELECT_SONNETS_BYUSER = @"SELECT 
                                                        s.id
                                                        , title
                                                        , wordcount
                                                        , [text]
                                                        , 1 AS 'HasHistory'
                                                    FROM 
                                                        type_on_willie.dbo.Sonnets s
                                                    WHERE 
                                                        id IN (
                                                            SELECT DISTINCT 
                                                                sonnetid
                                                            FROM 
                                                                type_on_willie.dbo.TypeSessions ts
                                                            WHERE 
                                                                userid = @userId
                                                        )
                                                    UNION 
                                                    SELECT 
                                                        s.id
                                                        , title
                                                        , wordcount
                                                        , [text]
                                                        , 0 AS 'HasHistory'
                                                    FROM 
                                                        type_on_willie.dbo.Sonnets s
                                                    WHERE 
                                                        id NOT IN (
                                                            SELECT DISTINCT 
                                                                sonnetid
                                                            FROM 
                                                                type_on_willie.dbo.TypeSessions ts
                                                            WHERE 
                                                                userid = @userId
                                                        )";

        public const string SELECT_STATS_ALL = @"SELECT 
                                                    AVG(correctwordcount * 1.0/typedwordcount) AS AverageAccuracy
                                                    , AVG(SecondsElapsed * 1.0) AS AverageTime
                                                    , AVG(TypedWordCount * 1.0 /SecondsElapsed*60.0) AS AverageWpm
                                                    , 1 AS Scope
                                                FROM 
                                                    type_on_willie.dbo.TypeSessions
                                                WHERE 
                                                    typedwordcount > 0
                                                    AND secondselapsed > 0
                                                    AND userid = @userId
                                                    AND sonnetid = @sonnetId
                                                UNION
                                                SELECT 
                                                    AVG(correctwordcount * 1.0/typedwordcount) AS AverageAccuracy
                                                    , AVG(SecondsElapsed * 1.0) AS AverageTime
                                                    , AVG(TypedWordCount * 1.0 /SecondsElapsed*60.0) AS AverageWpm
                                                    , 0 AS Scope
                                                FROM 
                                                    type_on_willie.dbo.TypeSessions
                                                WHERE 
                                                    typedwordcount > 0
                                                    AND secondselapsed > 0
                                                    AND userid <> @userId
                                                    AND sonnetid = @sonnetId;";

        public const string SELECT_STATS_GLOBAL = @"SELECT 
                                                    AVG(correctwordcount * 1.0/typedwordcount) AS AverageAccuracy
                                                    , AVG(SecondsElapsed * 1.0) AS AverageTime
                                                    , AVG(TypedWordCount * 1.0 /SecondsElapsed*60.0) AS AverageWpm
                                                    , 0 AS Scope
                                                FROM 
                                                    type_on_willie.dbo.TypeSessions
                                                WHERE 
                                                    sonnetid = @sonnetId;";

        public const string SELECT_MISSPELLINGS_ALL = @"SELECT TOP 5 
                                                            ModelWord
                                                            , COUNT(modelword) as 'Frequency'
                                                            , Linenumber
                                                            , [Index]
                                                            , 1 AS Scope
                                                        FROM 
                                                            type_on_willie.dbo.TypeSessions ts
                                                        INNER JOIN 
                                                            type_on_willie.dbo.Misspellings ms
                                                            ON ts.id = ms.TypeSessionId
                                                        WHERE 
                                                            userid = @userId
                                                            AND sonnetid = @sonnetId
                                                        GROUP BY 
                                                            modelword, linenumber, [index]
                                                        UNION
                                                        SELECT TOP 5 
                                                            modelWord
                                                            , COUNT(modelword) AS 'Frequency'
                                                            , LineNumber
                                                            , [Index]
                                                            , 0 AS Scope
                                                        FROM 
                                                            type_on_willie.dbo.TypeSessions ts
                                                        INNER JOIN 
                                                            type_on_willie.dbo.Misspellings ms
                                                        ON 
                                                            ts.id = ms.TypeSessionId
                                                        WHERE 
                                                            userid <> @userId 
                                                            AND sonnetid = @sonnetId
                                                        GROUP BY 
                                                            modelword, linenumber, [index]
                                                        ORDER BY 
                                                            Frequency DESC;";

        public const string SELECT_MISSPELLINGS_GLOBAL = @"SELECT TOP 5 
                                                            modelWord
                                                            , COUNT(modelword) AS 'Frequency'
                                                            , LineNumber
                                                            , [Index]
                                                            , 0 AS Scope
                                                        FROM 
                                                            type_on_willie.dbo.TypeSessions ts
                                                        INNER JOIN 
                                                            type_on_willie.dbo.Misspellings ms
                                                        ON 
                                                            ts.id = ms.TypeSessionId
                                                        WHERE 
                                                            sonnetid = @sonnetId
                                                        GROUP BY 
                                                            modelword, linenumber, [index]
                                                        ORDER BY 
                                                            Frequency DESC;";
    }
}
