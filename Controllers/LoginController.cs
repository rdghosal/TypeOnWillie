using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TypeOnWillie.Services;
using TypeOnWillie.Models;
using Microsoft.AspNetCore.Authorization;

namespace TypeOnWillie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class LoginController : ControllerBase
    {
        private readonly UserService _service;
        private readonly ITokenService _tokenService;

        public LoginController(UserService userService, ITokenService tokenService)
        {
            _service = userService;
            _tokenService = tokenService;
        }

        // POST: api/Login
        [HttpPost]
        public ActionResult Post(UserDto userDto)
        {
            User user = _service.VerifyUser(userDto);
            if (user == null) return BadRequest(userDto);

            string accessToken = _tokenService.GenerateToken(user);
            string refreshToken = _tokenService.GenerateRefreshToken(user);

            HttpContext.Response.Cookies.Append(
                "refreshToken",
                refreshToken,
                new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTimeOffset.Now.AddDays(5)
                });

            return Ok(new { accessToken });
            // return Ok(new UserDto { Username = userDto.Username, Id = user.Id }); 
        }
    }
}
