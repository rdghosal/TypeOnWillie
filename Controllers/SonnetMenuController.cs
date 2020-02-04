using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TypeOnWillie.DataAccess;
using TypeOnWillie.Models;
using TypeOnWillie.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TypeOnWillie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SonnetMenuController : ControllerBase
    {
        private readonly SonnetService _service;

        public SonnetMenuController(SonnetService sonnetService)
        {
            _service = sonnetService;
        }

        // GET: api/<controller>
        [HttpGet]
        public ActionResult Get()
        {
            return Ok(_service.GetSonnets());
        }
    }
}
