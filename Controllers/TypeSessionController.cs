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
    public class TypeSessionController : ControllerBase
    {
        private readonly TypeSessionService _service;

        public TypeSessionController(TypeSessionService typeSessionService)
        {
            _service = typeSessionService;
        }

        // POST: api/Score
        [HttpPost]
        [Route("LogSession")]
        public ActionResult Post(TypeSession typeSession)
        {
            return Ok(_service.AddTypeSession(typeSession));
        }
    }
}
