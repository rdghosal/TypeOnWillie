using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Web;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TypeOnWillie.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TypeOnWillie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VerseStreamController : ControllerBase
    {
        // GET: api/<controller>
        [HttpGet("{id}")]
        public Sonnet Get(int sonnetId)
        {
            Sonnet sonnet = new Sonnet(sonnetId, "fakeTitle", "fakeText");
            
            string connectionString = @"Data Source=RDB-PC\SQLEXPRESS;Initial Catalog=sonnet_db;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False"; 
            using (SqlConnection sonnetDbCon = new SqlConnection(connectionString)) {

                string query = "SELECT title, content FROM sonnet_db WHERE id=@id";
                SqlCommand cmd = new SqlCommand(query, sonnetDbCon);

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@Id";
                param.Value = sonnetId;

                cmd.Parameters.Add(param);

                sonnetDbCon.Open();
                using (SqlDataReader sonnetDbReader = cmd.ExecuteReader())
                {
                    string title = "";
                    string[] verses = new string[13];

                    while (sonnetDbReader.Read())
                    {
                        string content = (string)sonnetDbReader["content"];
                        verses = content.Split(","); //what to do for verses ending w/ comma?

                        title = (string)sonnetDbReader["title"];
                    }

                    return sonnet; // can this be parsed in F-E?
                }
            }
        }

        // POST api/<controller>
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }
    }
}
