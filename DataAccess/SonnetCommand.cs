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

        public const string SELECT_STATS_ALL = @"SELECT 
                                                    AVG(correctwordcount * 1.0/typedwordcount) AS AverageAccuracy
                                                    , AVG(SecondsElapsed * 1.0) AS AverageTime
                                                    , AVG(TypedWordCount * 1.0 /SecondsElapsed*60.0) AS AverageWpm
                                                    , 'U' AS Scope
                                                FROM 
                                                    type_on_willie.dbo.TypeSessions
                                                WHERE 
                                                    userid = @userId
                                                    AND sonnetid = @sonnetId
                                                UNION
                                                SELECT 
                                                    AVG(correctwordcount * 1.0/typedwordcount) AS AverageAccuracy
                                                    , AVG(SecondsElapsed * 1.0) AS AverageTime
                                                    , AVG(TypedWordCount * 1.0 /SecondsElapsed*60.0) AS AverageWpm
                                                    , 'G' AS Scope
                                                FROM 
                                                    type_on_willie.dbo.TypeSessions
                                                WHERE 
                                                    userid <> @userId
                                                    AND sonnetid = 1;";

        public const string SELECT_MISSPELLINGS_ALL = @"SELECT TOP 5 
                                                            modelWord
                                                            , COUNT(modelword) as 'Frequency'
                                                            , linenumber, [Index]
                                                            , 'U' AS Scope
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
                                                            , linenumber
                                                            , [Index]
                                                            , 'G' AS Scope
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
    }
}
