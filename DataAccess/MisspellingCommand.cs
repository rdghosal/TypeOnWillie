using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.DataAccess
{
    public class MisspellingCommand
    {
        public const string INSERT = @"INSERT INTO [type_on_willie].[dbo].[Misspellings] 
                                        (TypeSessionId
                                            , LineNumber
                                            , [Index]
                                            , ModelWord
                                            , TypedWord)
                                        VALUES (@typeSessionId
                                            , @lineNumber
                                            , @index
                                            , @modelWord
                                            , @typedWord);";
        public const string SELECT_TOP10 = @"SELECT
                                                TOP 10 [ModelWord]
                                            FROM [type_on_willie].[dbo].[Misspellings] m
                                            INNER JOIN [type_on_willie].[dbo].[TypeSessions] ts 
                                                ON m.typesessionid = ts.id
                                            INNER JOIN [type_on_willie].[dbo].[Users] u
                                                ON ts.userid = u.id
                                            WHERE u.id = @userId
                                                GROUP BY [ModelWord]
                                                ORDER BY COUNT([ModelWord]) DESC;";
    }
}
