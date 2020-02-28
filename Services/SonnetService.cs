using Microsoft.VisualBasic.FileIO;
using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;
using TypeOnWillie.DataAccess;

namespace TypeOnWillie.Services
{
    public class SonnetService
    {
        private readonly string[] _fileNames;
        private List<Sonnet> _sonnets;

        public SonnetService(string path)
        {
            _fileNames = Directory.GetFiles(path);
        }

        public List<Sonnet> GetSonnets()
        {
            if (_sonnets == null)
            {
                List<Sonnet> sonnets = new List<Sonnet>();
                foreach (string fileName in _fileNames)
                {
                    using (StreamReader sr = File.OpenText(fileName))
                    {
                        // Parse filename
                        string baseName = Path.GetFileNameWithoutExtension(fileName);
                        int sonnetId = Int32.Parse(baseName.Split("_")[0]);
                        string sonnetTitle = baseName.Split("_")[1];

                        int sonnetWordCount = 0;
                        List<string> sonnetContent = new List<string>();

                        // Load file
                        string line = ""; 
                        while ((line = sr.ReadLine()) != null)
                        {
                            sonnetWordCount += line.Split().Length;
                            sonnetContent.Add(line);
                        }

                        // Instantiate Sonnet and add to list
                        Sonnet sonnet = new Sonnet 
                        { 
                            Id = sonnetId, 
                            Title = sonnetTitle, 
                            WordCount=sonnetWordCount, 
                            Lines=sonnetContent 
                        };

                        sonnets.Add(sonnet);
                    }
                }

                // Cache sonnets
                _sonnets = sonnets;
            }

            return _sonnets;
        }

        public Sonnet GetSonnetById(int? id)
        {
            List<Sonnet> sonnets = (_sonnets != null) ? _sonnets : GetSonnets();

            foreach (Sonnet sonnet in sonnets)
            {
                if (id == sonnet.Id)
                {
                    return sonnet;
                }
            }

            // If sonnet was not found
            return null;
        }
    }
}
