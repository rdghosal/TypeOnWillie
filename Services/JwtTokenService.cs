using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TypeOnWillie.Models;

namespace TypeOnWillie.Services
{
    public class JwtTokenService : ITokenService
    {
        private readonly string _secret;

        public JwtTokenService(string secret)
        {
            _secret = secret;
        }

        public string GenerateToken(UserDto userDto)
        {
            // Payload
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, userDto.Username),
                new Claim(ClaimTypes.NameIdentifier, userDto.Id.ToString()), // Check Type 
                new Claim(JwtRegisteredClaimNames.Nbf,
                    new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds().ToString()),
                new Claim(JwtRegisteredClaimNames.Exp,
                    new DateTimeOffset(DateTime.Now.AddMinutes(5)).ToUnixTimeSeconds().ToString())
            };

            // Generate token using HmacSha256 alg + secret
            JwtSecurityToken token = new JwtSecurityToken(
                new JwtHeader(
                    new SigningCredentials(
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret)),
                        SecurityAlgorithms.HmacSha256)),
                new JwtPayload(claims));

            // Serialize into string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public dynamic GenerateRefreshToken(int size=32)
        {
            // Generate random base64 string
            string randomString;
            byte[] randomNumber = new byte[size];
            using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                randomString = Convert.ToBase64String(randomNumber);
            }

            // Add expiration to refreshToken
            return new
            {
                Refresh_Token = randomString,
                Expiration = DateTimeOffset.Now.AddDays(5).ToUnixTimeSeconds().ToString()
            };
        }
    }
}
