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
    public class ScoreController : ControllerBase
    {
        private readonly ScoreService _service;

        public ScoreController(ScoreService scoreService)
        {
            _service = scoreService;
        }

        // POST: api/Score
        [HttpPost]
        public ActionResult Post([FromBody] Score score)
        {
            return Ok(_service.AddScore(score));
        }
    }
}
