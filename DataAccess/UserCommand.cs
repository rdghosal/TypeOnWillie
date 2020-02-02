using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.DataAccess
{
    public static class UserCommand
    {
        public const string SELECT = @"SELECT UserId FROM [type_on_willie].[Users] 
                                       WHERE Username LIKE @username;";
        public const string INSERT = @"INSERT INTO [type_on_willie].[Users] (Username)
                                       VALUES (@username);";
    }
}
