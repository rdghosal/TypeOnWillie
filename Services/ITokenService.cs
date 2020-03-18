using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;

namespace TypeOnWillie.Services
{
    public interface ITokenService
    {
        public string GenerateToken(User user);

        public string GenerateRefreshToken(User user, int size=32);
    }
}
