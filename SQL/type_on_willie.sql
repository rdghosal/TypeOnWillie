-- Create database
CREATE DATABASE [type_on_willie];
USE [type_on_willie];
PRINT('Created database [type_on_willie].');

-- Create Sonnet table & bulk insert from CSV
CREATE TABLE [dbo].[Sonnets] (
    [SonnetId] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [Title] VARCHAR(15) NOT NULL,
    [Text] NVARCHAR(MAX) NOT NULL
);

PRINT('Created table [dbo].[Sonnets].
       Inserting data into [dbo].[Sonnets]...');

BULK INSERT [dbo].[Sonnets]
FROM '/tmp/sonnet_data.csv'
WITH (
    FORMAT='CSV',
    FIELDTERMINATOR=',',
    ROWTERMINATOR='\n'
);
PRINT('Bulk insert into table [dbo].[Sonnets] complete.');

-- Create Users table
CREATE TABLE [dbo].[Users] (
    [UserId] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [DateTime] DATETIME NOT NULL,
    [Username] VARCHAR(15) NOT NULL,
    [Hash] VARCHAR(255) NOT NULL
);
PRINT('Created table [dbo].[Users]');

-- Create Scores table
CREATE TABLE [dbo].[Scores] (
    [ScoreId] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [UserId] INT NOT NULL,
    [SonnetId] INT NOT NULL,
    [DateTime] DATETIME NOT NULL,
    [SuccessRate] FLOAT NOT NULL,
    [Misspellings] VARCHAR(MAX),
    CONSTRAINT FK_Scores_Users FOREIGN KEY (UserId)
    REFERENCES [dbo].[Users] (UserId),
    CONSTRAINT FK_Scores_Sonnets FOREIGN KEY (SonnetId)
    REFERENCES [dbo].[Sonnets] (SonnetId)
);
PRINT('Created table [dbo].[Scores]');

-- Success
PRINT('Completed setup of database [type_on_willie].[dbo].');