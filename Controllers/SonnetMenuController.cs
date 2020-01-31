using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TypeOnWillie.Models;
using TypeOnWillie.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TypeOnWillie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SonnetMenuController : Controller
    {
        private readonly string csvFilename = Environment.GetEnvironmentVariable("CSV_PATH");

        // GET: api/<controller>
        [HttpGet]
        public List<Sonnet> Get()
        {
            return HomeService.LoadSonnets(csvFilename);
        }
    }
}
