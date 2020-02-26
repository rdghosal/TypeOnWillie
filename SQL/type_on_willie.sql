-- Create database
IF (db_id(N'type_on_willie') IS NULL) 
    BEGIN 
        CREATE DATABASE [type_on_willie];
        PRINT('Created database [type_on_willie].');
    END
USE [type_on_willie];

-- Create Sonnet table & bulk insert from CSV
-- NOTE: Using default schema [dbo]
IF NOT EXISTS (
    SELECT * FROM sys.tables 
    WHERE [name] LIKE 'Sonnets'
)
    BEGIN
        CREATE TABLE [dbo].[Sonnets] (
            [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
            [Length] INT NOT NULL,
            [FileName] NVARCHAR(MAX) NOT NULL
        );

        PRINT('Created table [dbo].[Sonnets].');
        PRINT('Inserting data into [dbo].[Sonnets]...');

        -- Insert data from local .csv
        BULK INSERT [dbo].[Sonnets]
        FROM '/tmp/sonnet_map.csv'
        WITH (
            FORMAT='CSV',
            FIELDTERMINATOR=',',
            ROWTERMINATOR='\n'
        );
        PRINT('Bulk insert into table [dbo].[Sonnets] complete.');
    END

-- Create Users table
IF NOT EXISTS (
    SELECT * FROM sys.tables
    WHERE [name] LIKE 'Users'
)
    BEGIN
        CREATE TABLE [dbo].[Users] (
            [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
            [DateTime] DATETIME NOT NULL,
            [Username] VARCHAR(15) NOT NULL,
            [Hash] VARCHAR(255) NOT NULL
        );
        PRINT('Created table [dbo].[Users]');
    END

-- Create Scores table
IF NOT EXISTS (
    SELECT * FROM sys.tables
    WHERE [name] LIKE 'Scores'
)
    BEGIN
        CREATE TABLE [dbo].[Scores] (
            [ScoreId] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
            [UserId] INT NOT NULL,
            [SonnetId] INT NOT NULL,
            [DateTime] DATETIME NOT NULL,
            [SuccessRate] FLOAT NOT NULL,
            [Misspellings] VARCHAR(MAX),
            CONSTRAINT FK_Scores_Users FOREIGN KEY (UserId)
            REFERENCES [dbo].[Users] (Id),
            CONSTRAINT FK_Scores_Sonnets FOREIGN KEY (SonnetId)
            REFERENCES [dbo].[Sonnets] (Id)
        );
        PRINT('Created table [dbo].[Scores]');
    END

-- Success
PRINT('Completed setup of database [type_on_willie].[dbo].');