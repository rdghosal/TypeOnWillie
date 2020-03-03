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
        public ActionResult Post(UserDto userDto)
        {
            User user = _service.VerifyUser(userDto);
            if (user == null) return BadRequest(userDto);

            // Send new dto to dispose password and hash
            return Ok(new UserDto { Username = userDto.Username, Id = user.Id }); 
        }
    }
}
