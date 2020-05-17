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
        public ActionResult GetProfile(ProfileParamsDto params_)
        {
            UserProfileDto profileDto = _service.GetUserProfile(params_);
            SysProfileDto sysProfileDto = _service.GetSysProfile(params_);

            dynamic response = new {
                userData = profileDto,
                overallData = sysProfileDto
            };

            if (profileDto == null) BadRequest();
            return Ok(response);
        }
        
        [HttpPost]
        [Route("Guest")]
        public ActionResult GetSysProfile(ProfileParamsDto params_)
        {
            SysProfileDto sysProfile = _service.GetSysProfile(params_);
            return Ok(sysProfile);
        }

    }
}
