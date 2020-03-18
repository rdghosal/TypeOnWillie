using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;

namespace TypeOnWillie.Services
{
    public interface ITokenService
    {
        public string GenerateToken(UserDto userDto);
    }
}
