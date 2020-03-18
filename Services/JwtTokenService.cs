using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TypeOnWillie.DataAccess;
using TypeOnWillie.Models;

namespace TypeOnWillie.Services
{
    public class JwtTokenService : ITokenService
    {
        private readonly string _secret;
        private readonly AuthSqlDao _dao;

        public JwtTokenService(string secret, AuthSqlDao dao)
        {
            _secret = secret;
            _dao = dao;
        }

        public string GenerateToken(User user)
        {
            // Payload
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Check Type 
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

        public string GenerateRefreshToken(User user, int size=32)
        {
            // Generate random base64 string
            string token;
            byte[] randomNumber = new byte[size];
            using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                token = Convert.ToBase64String(randomNumber);
            }

            AddRefreshToken(user, token);
            return token;
        }

        private int AddRefreshToken(User user, string refreshToken)
        {
            return _dao.InsertRefreshToken(user, refreshToken);
        }
    }
}
