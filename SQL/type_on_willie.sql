-- Create database
CREATE DATABASE [type_on_willie];
USE [type_on_willie];
PRINT('Created database [type_on_wille].');

-- Create Sonnet table & bulk insert from CSV
CREATE TABLE [type_on_willie].[Sonnets] (
    [SonnetId] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [Number] VARCHAR(15) NOT NULL,
    [Text] VARCHAR(MAX) NOT NULL
);

PRINT('Created table [type_on_willie].[Sonnets].
       Inserting data into [type_on_willie].[Sonnets]...');

BULK INSERT [type_on_willie].[Sonnets]
FROM '..\sonnet_data.csv'
WITH (FORMAT='CSV');
PRINT('Bulk insert into table [type_on_willie].[Sonnets] complete.');

-- Create Users table
CREATE TABLE [type_on_willie].[Users] (
    [UserId] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [DateTime] DATETIME NOT NULL,
    [Username] VARCHAR(15) NOT NULL,
    [Hash] VARCHAR(255) NOT NULL
);
PRINT('Created table [type_on_willie].[Users]');

-- Create Scores table
CREATE TABLE [type_on_willie].[Scores] (
    [ScoreId] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [UserId] INT NOT NULL,
    [SonnetId] INT NOT NULL,
    [DateTime] DATETIME NOT NULL,
    [Misspellings] VARCHAR(MAX),
    CONSTRAINT FK_Scores_Users FOREIGN KEY (UserId)
    REFERENCES [type_on_willie].[Users] (UserId),
    CONSTRAINT FK_Scores_Sonnets FOREIGN KEY (SonnetId)
    REFERENCES [type_on_willie].[Sonnets] (SonnetId)
);
PRINT('Created table [type_on_willie].[Scores]');

-- Success
PRINT('Completed setup of database [type_on_willie].');