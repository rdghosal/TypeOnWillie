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
        private readonly ScoreSqlDao _dao;

        public ScoreService(ScoreSqlDao scoreSqlDao)
        {
            _dao = scoreSqlDao;
        }

        public int AddScore(Score score)
        {
            return _dao.InsertScore(score);
        }
    }
}
