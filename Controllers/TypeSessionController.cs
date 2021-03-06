﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TypeOnWillie.DataAccess;
using TypeOnWillie.Models;
using TypeOnWillie.Services;

namespace TypeOnWillie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class TypeSessionController : ControllerBase
    {
        private readonly TypeSessionService _service;

        public TypeSessionController(TypeSessionService typeSessionService)
        {
            _service = typeSessionService;
        }

        // POST: api/TypeSession/LogSession
        [HttpPost]
        [Route("LogSession")]
        public ActionResult Post(TypeSession typeSession)
        {
            try
            {
                _service.AddTypeSession(typeSession);
                return Ok();
            }
            catch
            {
                return BadRequest($"Invalid session data { typeSession }");
            }
        }
    }
}
