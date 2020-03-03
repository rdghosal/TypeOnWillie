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
            // Serialize userDto to User after hashing password
            string hashed = _passwordHasher.HashPassword(userDto, userDto.Password);
            return _dao.InsertUser(new User
            {
                Username = userDto.Username,
                Hash = hashed,
                Age = userDto.Age,
                Nationality = userDto.Nationality,
                HighestEducation = userDto.HighestEducation,
            });
        }

        public User VerifyUser(UserDto userDto)
        {
            // Get user and verify password
            User user = _dao.SelectUser(userDto);
            if (user == null || _passwordHasher.VerifyHashedPassword(userDto, userDto.Password, user.Hash) 
                == PasswordVerificationResult.Failed)
            {
                return null;
            }
            // Verified
            return user;
        }
    }
}
