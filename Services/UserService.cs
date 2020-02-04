using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.DataAccess;
using TypeOnWillie.Models;
using Microsoft.AspNetCore.Identity;

namespace TypeOnWillie.Services
{
    public class UserService
    {
        private readonly UserSqlDao _dao;
        private static PasswordHasher<UserDto> _passwordHasher;

        public UserService(UserSqlDao sqlDao, PasswordHasher<UserDto> passwordHasher)
        {
            _dao = sqlDao;
            _passwordHasher = passwordHasher;
        }
        public int AddUser(UserDto userDto)
        {
            // Check if username exists; if not, add to database
            if (_dao.SelectUser(userDto) != null) return -1;
            string hashed = _passwordHasher.HashPassword(userDto, userDto.Password);
            return _dao.InsertUser(new User(userDto.Username, hashed));
        }
        public int VerifyUser(UserDto userDto)
        {
            // Get user and verify password
            User user = _dao.SelectUser(userDto);
            if (user == null)
            {
                return -1;
            }
            else if (_passwordHasher.VerifyHashedPassword(userDto, userDto.Password, user.Hash) == PasswordVerificationResult.Failed)
            {
                return -2;
            }
            // Verified
            return 0;
        }
    }
}
