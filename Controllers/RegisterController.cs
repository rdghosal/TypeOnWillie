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
    public class RegisterController : ControllerBase
    {
        // POST: api/Register
        [HttpPost]
        public ActionResult Post([FromBody] string username, string password, UserService userService)
        {
            // Status Code 400
            if (userService.AddUser(new UserDto { Username = username, Password = password }) == -1)
            {
                return BadRequest();
            }

            // Status Code 201
            return CreatedAtRoute(nameof(userService.AddUser), new { username, password });
        }
    }
}