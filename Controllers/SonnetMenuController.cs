using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        // GET: api/<controller>
        [HttpGet]
        public ActionResult Get(int? id)
        {
            // Get particular sonnet by sonnet id
            if (id.HasValue)
            {
                if (id < 1 || id > 154)
                {
                    return NotFound();
                }
                return Ok(_service.GetSonnetById(id));
            }

            // If no id, return all sonnets
            return Ok(_service.GetSonnets());
        }

        [HttpPost]
        [Route("history")]
        public IActionResult GetSonnetHistory(SonnetHistoryParams params_)
        {
            SonnetHistoryDto sonnetHistory = _service.GetSonnetHistory(params_);
            return Ok(sonnetHistory); 
        }
    }
}
