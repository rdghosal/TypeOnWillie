using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.DataAccess
{
    public static class UserCommand
    {
        public const string SELECT = @"SELECT Id, Username, Hash FROM [type_on_willie].[dbo].[Users] 
                                       WHERE Username LIKE @username;";
        public const string INSERT = @"INSERT INTO [type_on_willie].[dbo].[Users] (Username, Hash, Age, Nationality, HighestEducation)
                                       VALUES (@username, @hash, @age, @nationality, @highestEducation);";
    }
}
