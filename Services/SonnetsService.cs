using Microsoft.VisualBasic.FileIO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;

namespace TypeOnWillie.Services
{
    public class SonnetsService
    {
        public static List<Sonnet> LoadSonnets(string csvFilename)
        {
            List<Sonnet> sonnetList = new List<Sonnet>();
            using (TextFieldParser csvParser = new TextFieldParser(csvFilename))
            {
                csvParser.SetDelimiters(new string[] { "," });
                csvParser.ReadLine();
                while(!csvParser.EndOfData)
                {
                    // Read sonnet data from csv
                    string[] fields = csvParser.ReadFields();
                    int sonnetNum = int.Parse(fields[0]);
                    string sonnetTitle = fields[1];
                    string sonnetText = fields[2];

                    // Store sonnet in dict to be returned
                    sonnetList.Add(new Sonnet(sonnetNum, sonnetTitle, sonnetText));
                }
            }
            return sonnetList;
        }
    }
}
