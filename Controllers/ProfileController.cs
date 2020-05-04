using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlTypes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TypeOnWillie.DataAccess;
using TypeOnWillie.Models;
using TypeOnWillie.Services;
using Microsoft.AspNetCore.Authorization;

namespace TypeOnWillie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly ProfileService _service;

        public ProfileController(ProfileService profileService)
        {
            _service = profileService;
        }

        // POST: api/Profile/5
        [Authorize]
        [HttpPost("{id}", Name = "GetProfile")]
        public ActionResult GetProfile(Guid id)
        {
            UserProfileDto userProfileDto = _service.GetUserProfile(new UserDto { Id = id });
            if (userProfileDto == null) BadRequest();
            return Ok(userProfileDto);
        }

    }
}
