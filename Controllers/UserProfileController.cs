using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TypeOnWillie.DataAccess;
using TypeOnWillie.Models;
using TypeOnWillie.Services;

namespace TypeOnWillie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly UserProfileService _service;

        public UserProfileController(UserProfileService userProfileService)
        {
            _service = userProfileService;
        }

        // GET: api/UserProfile/5
        [HttpGet("{id}", Name = "Get")]
        public ActionResult Get(int id)
        {
            UserProfileDto userProfileDto = _service.GetUserProfile(new UserDto { UserId = id });
            if (userProfileDto == null) BadRequest();
            return Ok(userProfileDto);
        }
    }
}
