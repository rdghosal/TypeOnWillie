using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.DataAccess
{
    public class AuthCommand
    {
        public static string INSERT = "INSERT INTO [type_on_willie].[dbo].[RefreshTokens] ( UserID, Token, Expires ) VALUES(@UserId, @Token, @Expires)";

        public static string UPDATE = "UPDATE [type_on_willie].[dbo].[RefreshTokens] SET Valid = 'N' WHERE Token = @token";

        public static string SELECT = @"SELECT UserId, Username, Expires 
                                        FROM [type_on_willie].[dbo].[RefreshTokens] R 
                                        INNER JOIN [type_on_willie].[dbo].[Users] U ON R.UserId = U.Id
                                        WHERE Token = @token AND Expires > GETDATE() AND VALID = 'Y'";
    }
}
