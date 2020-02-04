using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.DataAccess;
using TypeOnWillie.Models;

namespace TypeOnWillie.Services
{
    public class ScoreService
    {
        internal object AddScore(Score score, ScoreSqlDao scoreSqlDao)
        {
            return scoreSqlDao.InsertScore(score);
        }
    }
}
