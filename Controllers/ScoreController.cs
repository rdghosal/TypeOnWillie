using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TypeOnWillie.Models;
using TypeOnWillie.Services;

namespace TypeOnWillie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScoreController : ControllerBase
    {
        // POST: api/Score
        [HttpPost]
        public ActionResult Post([FromBody] Score score, ScoreService scoreService)
        {
            return Ok(scoreService.AddScore(score));
        }
    }
}
