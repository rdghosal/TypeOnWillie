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
        // GET: api/UserProfile/5
        [HttpGet("{id}", Name = "Get")]
        public ActionResult Get(int id, UserProfileService userProfileService, ScoreSqlDao scoreSqlDao)
        {
            UserProfileDto userProfileDto = userProfileService.GetUserProfile(new UserDto { UserId = id }, scoreSqlDao);
            if (userProfileDto == null) BadRequest();
            return Ok(userProfileDto);
        }
    }
}
