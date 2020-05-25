using Microsoft.VisualBasic.FileIO;
using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;
using TypeOnWillie.DataAccess;
using Microsoft.Extensions.Configuration;

namespace TypeOnWillie.Services
{
    public class SonnetService
    {
        private readonly string[] _fileNames;
        private readonly SonnetSqlDao _sonnetSqlDao;
        private List<Sonnet> _sonnets;

        public SonnetService(IConfiguration configuration, SonnetSqlDao sonnetSqlDao)
        {
            _fileNames = Directory.GetFiles(configuration["SonnetPath"]);
            _sonnetSqlDao = sonnetSqlDao;
        }

        //public List<Sonnet> GetSonnetsFromDirectory()
        //{
        //    if (_sonnets == null)
        //    {
        //        var sonnets = new List<SonnetDto>();
        //        foreach (string fileName in _fileNames)
        //        {
        //            using (StreamReader sr = File.OpenText(fileName))
        //            {
        //                // Parse filename
        //                string baseName = Path.GetFileNameWithoutExtension(fileName);
        //                int sonnetId = Int32.Parse(baseName.Split("_")[0]);
        //                string sonnetTitle = baseName.Split("_")[1];

        //                int sonnetWordCount = 0;
        //                List<string> sonnetContent = new List<string>();

        //                // Load file
        //                string line = ""; 
        //                while ((line = sr.ReadLine()) != null)
        //                {
        //                    sonnetWordCount += line.Split().Length;
        //                    sonnetContent.Add(line);
        //                }

        //                // Instantiate Sonnet and add to list
        //               SonnetDto sonnet = new SonnetDto 
        //                { 
        //                    Id = sonnetId, 
        //                    Title = sonnetTitle, 
        //                    WordCount=sonnetWordCount, 
        //                    Lines=sonnetContent
        //                };

        //                sonnets.Add(sonnet);
        //            }
        //        }

        //        // Cache sonnets
        //        _sonnets = sonnets;
        //    }

        //    return _sonnets;
        //}

        public IEnumerable<SonnetDto> GetSonnets(SonnetParams params_)
        {
            return ConvertSonnets(_sonnetSqlDao.SelectSonnets(params_));
        }

        private IEnumerable<SonnetDto> ConvertSonnets(IEnumerable<Sonnet> sonnets)
        {
            var sonnetCollection = new List<SonnetDto>();

            foreach (var s in sonnets)
            {
                var sonnet = new SonnetDto(s);
                sonnetCollection.Add(sonnet);
            }

            return sonnetCollection;
        }

        //public Sonnet GetSonnetById(int? id)
        //{
        //    List<Sonnet> sonnets = (_sonnets != null) ? _sonnets : GetSonnets();

        //    foreach (Sonnet sonnet in sonnets)
        //    {
        //        if (id == sonnet.Id)
        //        {
        //            return sonnet;
        //        }
        //    }

        //    // If sonnet was not found
        //    return null;
        //}

        public SonnetHistoryDto GetSonnetHistory(SonnetHistoryParams params_)
        {
            IEnumerable<Misspelling> misspellings = 
                _sonnetSqlDao.SelectMisspellingsAll(params_);
            IEnumerable<SonnetStatistic> statistics = 
                _sonnetSqlDao.SelectStatisticsAll(params_);

            var sonnetHistory = new SonnetHistoryDto(statistics, misspellings);
            return sonnetHistory;
        }
    }
}
