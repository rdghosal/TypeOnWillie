using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using TypeOnWillie.DataAccess;
using TypeOnWillie.Models;
using TypeOnWillie.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TypeOnWillie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class SonnetMenuController : ControllerBase
    {
        private readonly SonnetService _service;

        public SonnetMenuController(SonnetService sonnetService)
        {
            _service = sonnetService;
        }

        [HttpPost]
        [Route("history")]
        public IActionResult GetSonnetHistory(SonnetHistoryParams params_)
        {
            SonnetHistoryDto sonnetHistory = _service.GetSonnetHistory(params_);
            return Ok(sonnetHistory); 
        }

        [HttpPost]
        public IActionResult GetSonnets(SonnetParams params_)
        {
            return Ok(_service.GetSonnets(params_));
        }
    }
}
