using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TypeOnWillie.Models;
using TypeOnWillie.Services;

namespace TypeOnWillie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly ITokenService _service;

        public TokenController(ITokenService service)
        {
            _service = service;
        }

        // POST: api/Token/Refresh
        [HttpPost]
        [Route("Refresh")]
        public ActionResult Refresh()
        {
            // Verify refreshToken and return new accessToken
            string refreshToken = HttpContext.Request.Cookies["refreshToken"];

            if (refreshToken == null) return BadRequest("Must login again");
            var userData = _service.VerifyRefreshToken(refreshToken);

            if (userData == null) return Forbid(); // Invalid refreshToken
            string accessToken = _service.GenerateToken(new User { Id = userData.UserId, Username = userData.Username });

            return Ok(new { accessToken });
        }

        // POST: api/token/logout
        [HttpPost]
        [Route("Logout")]
        public ActionResult Logout()
        {
            if (HttpContext.Request.Cookies["refreshToken"] == null) 
            {
                return BadRequest();
            }

            string refreshToken = HttpContext.Request.Cookies["refreshToken"];
            string accessToken = HttpContext.Request.Headers["Authorization"];
            accessToken = accessToken.Split(" ")[1];

            // Blacklist the token in database and cache
            _service.BlacklistTokens(refreshToken, accessToken);

            return Ok();
        }

    }
}
