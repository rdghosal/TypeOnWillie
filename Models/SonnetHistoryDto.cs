using Microsoft.AspNetCore.Diagnostics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeOnWillie.Models
{
    public class SonnetHistoryDto
    {
        private readonly Dictionary<string, SonnetStatistic> _statistics;
        private readonly Dictionary<string, IEnumerable<Misspelling>> _misspellings;

        public Dictionary<string, SonnetStatistic> Statistics
        {
            get
            {
                return _statistics;
            }
        }

        public Dictionary<string, IEnumerable<Misspelling>> Misspellings
        {
            get
            {
                return _misspellings;
            }
        }

        public SonnetHistoryDto(IEnumerable<SonnetStatistic> statistics, IEnumerable<Misspelling> misspellings)
        {
            _statistics = _SetStatistics(statistics);
            _misspellings = _SetMisspellings(misspellings);
        }

        private Dictionary<string, SonnetStatistic> _SetStatistics(IEnumerable<SonnetStatistic> stats)
        {
            if (stats.Count() > 2)
            {
                Console.WriteLine("Argument size too large!");
                return null;
            }

            var sonnetDict = new Dictionary<string, SonnetStatistic>();
            
            foreach (var s in stats) 
            {
                if (s.Scope == ScopeType.GLOBAL)
                {
                    sonnetDict.Add("Global", s);        
                }
                else
                {
                    sonnetDict.Add("User", s);
                }
            }

            return sonnetDict;
        }

        private Dictionary<string, IEnumerable<Misspelling>> _SetMisspellings(IEnumerable<Misspelling> misspellings)
        {
            var misspellingDict = new Dictionary<string, IEnumerable<Misspelling>>();

            var userList = new List<Misspelling>();
            var globalList = new List<Misspelling>();

            foreach (var m in misspellings)
            {
                if (m.Scope == ScopeType.GLOBAL)
                {
                    globalList.Add(m);
                }
                else
                {
                    userList.Add(m);
                }
            }

            misspellingDict.Add("User", userList);
            misspellingDict.Add("Global", globalList);

            return misspellingDict;
        }


    }

    
}
