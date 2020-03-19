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
        public ActionResult Post()
        {
            // Verify refreshToken and return new accessToken
            string refreshToken = HttpContext.Request.Cookies["refreshToken"];
            var userData = _service.VerifyRefreshToken(refreshToken);

            if (userData == null) return Forbid(); // Invalid refreshToken
            string accessToken = _service.GenerateToken(new User { Id = userData.Id, Username = userData.Username });

            return Ok(accessToken);
        }
    }
}
