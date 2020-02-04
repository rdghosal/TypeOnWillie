using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TypeOnWillie.Services;
using TypeOnWillie.Models;

namespace TypeOnWillie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly UserService _service;

        public LoginController(UserService userService)
        {
            _service = userService;
        }
        // POST: api/Login
        [HttpPost]
        public ActionResult Post([FromBody] UserDto userDto)
        {
            if (_service.VerifyUser(userDto) == -1)
            {
                // Status code 400
                return BadRequest();
            }

            // Status code 200
            return Ok();
        }
    }
}
