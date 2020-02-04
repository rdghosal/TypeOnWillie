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
        private readonly UserService _service;

        public RegisterController(UserService userService)
        {
            _service = userService;
        }

        // POST: api/Register
        [HttpPost]
        public ActionResult Post([FromBody] UserDto userDto)
        {
            try
            {
                return CreatedAtRoute(nameof(_service.AddUser), userDto); // Status code 201
            }
            catch
            {
                return BadRequest(); // Status code 400
            }
        }
    }
}