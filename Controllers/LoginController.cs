using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TypeOnWillie.Services;

namespace TypeOnWillie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        // POST: api/Login
        [HttpPost]
        public ActionResult Post([FromBody] string username, string password, UserService userService)
        {
            if (userService.VerifyUser(new Models.UserDto { Username=username, Password=password }) == -1)
            {
                // Status code 400
                return BadRequest();
            }

            // Status code 200
            return Ok();
        }
    }
}
