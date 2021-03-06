﻿using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using TypeOnWillie.Models;

namespace TypeOnWillie.DataAccess
{
    public class TypeSessionSqlDao : SqlDao
    {

        private readonly IConfiguration _config;

        public TypeSessionSqlDao(SqlConnection sqlConnection, IConfiguration config) : base(sqlConnection)
        {
            _config = config;
        }

        public int InsertTypeSession(TypeSession typeSession)
        {
            using (var _sqlConnection = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                _sqlConnection.Open();
                if (typeSession.UserId != "guest") 
                {
                    return _sqlConnection.Execute(TypeSessionCommand.INSERT, new
                    {
                        userId = typeSession.UserId,
                        sonnetId = typeSession.SonnetId,
                        secondsElapsed = typeSession.SecondsElapsed,
                        correctWordCount = typeSession.CorrectWordCount,
                        typedWordCount = typeSession.TypedWordCount,
                        misspelledWordCount = typeSession.MisspelledWordCount,
                        quit = typeSession.Quit,
                        touchScreen = typeSession.TouchScreen
                    });
                }
                else 
                {
                    return _sqlConnection.Execute(TypeSessionCommand.INSERT_GUEST, new
                    {
                        sonnetId = typeSession.SonnetId,
                        secondsElapsed = typeSession.SecondsElapsed,
                        correctWordCount = typeSession.CorrectWordCount,
                        typedWordCount = typeSession.TypedWordCount,
                        misspelledWordCount = typeSession.MisspelledWordCount,
                        quit = typeSession.Quit,
                        touchScreen = typeSession.TouchScreen
                    });
                }
            }
        }

        public void InsertWordTuples(TypeSession typeSession)
        {
            List<WordTuple> wordTuples = typeSession.MisspelledWords;
            using (var _sqlConnection = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                dynamic result = null;
                _sqlConnection.Open();

                // Find latest TypeSession.Id
                if (typeSession.UserId != "guest")
                {
                    result = _sqlConnection.Query<TypeSession>(TypeSessionCommand.SELECT, 
                    new 
                    { 
                        userId = typeSession.UserId
                    }).FirstOrDefault();
                }
                else
                {
                    result = _sqlConnection.Query<TypeSession>(TypeSessionCommand.SELECT_GUEST).FirstOrDefault();
                }

                // Iterate over each List of WordTuples and INSERT
                foreach (WordTuple wt in wordTuples)
                {
                    _sqlConnection.Execute(MisspellingCommand.INSERT, 
                    new
                    {
                        typeSessionId = result.Id,
                        lineNumber = wt.LineNumber,
                        index = wt.Index,
                        modelWord = wt.ModelWord,
                        typedWord = wt.TypedWord
                    });
                }
            }
        }

        public SysProfileDto SelectSysProfile(ProfileParamsDto params_)
        {
            SysProfileDto sysProfile = new SysProfileDto();

            using (var _sqlConnection = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                sysProfile.Metrics = _sqlConnection.Query<UserMetrics>(
                    TypeSessionCommand.SELECT_ALL_METRICS).FirstOrDefault();

                sysProfile.Scores = SelectSysScores(params_);
            }

            return sysProfile;
        }

        public UserProfileDto SelectProfile(ProfileParamsDto params_)
        {
            UserProfileDto profile = new UserProfileDto();

            using (var _sqlConnection = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                profile.Percentiles = _sqlConnection.Query<PercentileCollection>(
                    TypeSessionCommand.SELECT_USER_PERCENTILES, 
                    new { userId = params_.UserId }).FirstOrDefault();

                profile.TopMisspellings = _sqlConnection.Query<string>(
                    MisspellingCommand.SELECT_TOP10,
                    new { userId = params_.UserId });

                profile.Records = _sqlConnection.Query<RecordCollection>(
                    TypeSessionCommand.SELECT_USER_RECORDS,
                    new { userId = params_.UserId }).FirstOrDefault();

                profile.Scores = SelectScores(params_);

                return profile;
            }
        }
        
        private IEnumerable<ScoreCollection> SelectScores(ProfileParamsDto params_)
        {
            using (var _sqlConnection = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                string q = (params_.TimeScale == ScaleType.YEAR) 
                    ? TypeSessionCommand.SELECT_SCORES_LASTYEAR 
                    : TypeSessionCommand.SELECT_SCORES_BYMONTH;

                    return _sqlConnection.Query<ScoreCollection>(
                        q,
                        new { userId = params_.UserId, endDate = params_.EndDate });
            }
        }

        private IEnumerable<ScoreCollection> SelectSysScores(ProfileParamsDto params_)
        {
            using (var _sqlConnection = new SqlConnection(_config.GetConnectionString("mssql")))
            {
                string q = (params_.TimeScale == ScaleType.YEAR) 
                    ? TypeSessionCommand.SELECT_SCORES_LASTYEAR_ALL 
                    : TypeSessionCommand.SELECT_SCORES_BYMONTH_ALL;

                    return _sqlConnection.Query<ScoreCollection>(
                        q,
                        new { endDate = params_.EndDate });
            }
        }
    }
}
