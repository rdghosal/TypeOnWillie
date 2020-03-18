using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.DataAccess
{
    public class AuthCommand
    {
        public static string INSERT = "INSERT INTO [type_on_willie].[dbo].[RefreshTokens] ( UserID, Expires, Token ) VALUES(@userId, @expires, @token)";
    }
}
