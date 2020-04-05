using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.DataAccess
{
    public class MisspellingCommand
    {
        public const string INSERT = @"INSERT INTO [type_on_willie].[dbo].[Misspellings] (TypeSessionId, LineNumber, Index, ModelWord, TypedWord)
                                       VALUES (@typeSessionId, @lineNumber, @index, @modelWord, @typedWord);";
    }
}
