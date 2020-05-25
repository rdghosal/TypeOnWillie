-- Create database
IF (DB_ID(N'type_on_willie') IS NULL)
    BEGIN 
        CREATE DATABASE [type_on_willie];
        PRINT('Created database [type_on_willie].');
        USE [type_on_willie];
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
            [WordCount] INT NOT NULL,
            [CapitalLetterCount] INT NOT NULL,
            [PunctuationCount] INT NOT NULL,
            [Title] VARCHAR(255) NOT NULL,
            [Text] NVARCHAR(MAX) NOT NULL,
        );

        PRINT('Created table [dbo].[Sonnets].');
        PRINT('Inserting data into [dbo].[Sonnets]...');

        -- Insert data from local .csv
        BULK INSERT [dbo].[Sonnets]
        FROM '/tmp/sonnet_map.csv'
        WITH (
            FORMAT='CSV',
            FIELDTERMINATOR='\t',
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
            [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
            [DateTime] DATETIME NOT NULL DEFAULT GETDATE(),
            [Username] VARCHAR(20) NOT NULL,
            [Hash] VARCHAR(255) NOT NULL,
            [Age] INT,
			[Nationality] VARCHAR(255),
			[HighestEducation] VARCHAR(15)
        );
        PRINT('Created table [dbo].[Users]');
    END

-- Create TypeSessions table
IF NOT EXISTS (
    SELECT * FROM sys.tables
    WHERE [name] LIKE 'TypeSessions'
)
    BEGIN
        CREATE TABLE [dbo].[TypeSessions] (
            [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
            [UserId] UNIQUEIDENTIFIER NOT NULL,
            [SonnetId] INT NOT NULL,
            [DateTime] DATETIME NOT NULL DEFAULT GETDATE(),
            [SecondsElapsed] INT NOT NULL,
            [CorrectWordCount] INT NOT NULL,
            [TypedWordCount] INT NOT NULL,
            [MisspelledWordCount] INT NOT NULL,
            [Quit] VARCHAR(1) NOT NULL DEFAULT 'N',
            [TouchScreen] VARCHAR(1) NOT NULL DEFAULT 'N',
            CONSTRAINT FK_Sessions_Users FOREIGN KEY (UserId)
            REFERENCES [dbo].[Users] (Id),
            CONSTRAINT FK_Sessions_Sonnets FOREIGN KEY (SonnetId)
            REFERENCES [dbo].[Sonnets] (Id),
            CONSTRAINT CHK_Quit CHECK (Quit IN ('Y', 'N')),
            CONSTRAINT CHK_TouchScreen CHECK (TouchScreen IN ('Y', 'N'))
        );
        PRINT('Created table [dbo].[TypeSessions]');
    END

-- Create Misspellings table
IF NOT EXISTS (
    SELECT * FROM sys.tables
    WHERE [name] LIKE 'Misspellings'
)
    BEGIN
        CREATE TABLE [dbo].[Misspellings] (
            [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
            [TypeSessionId] UNIQUEIDENTIFIER NOT NULL,
            [LineNumber] INT NOT NULL,
            [Index] INT NOT NULL,
            [ModelWord] VARCHAR(255) NOT NULL,
            [TypedWord] VARCHAR(255) -- Allow empty string user input
            CONSTRAINT FK_Misspellings_TypeSessions FOREIGN KEY (TypeSessionId)
            REFERENCES [dbo].[TypeSessions] (Id),
            CONSTRAINT CHK_LineNumber CHECK (LineNumber BETWEEN 1 AND 14)
        );
        PRINT ('Created table [dbo].[Misspellings]');
    END

-- Create RefreshTokens table
IF NOT EXISTS (
    SELECT * FROM sys.tables
    WHERE [name] LIKE 'RefreshTokens'
)
    BEGIN
        CREATE TABLE [dbo].[RefreshTokens] (
            [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
            [UserId] UNIQUEIDENTIFIER NOT NULL,
            [Expires] DATETIME NOT NULL DEFAULT GETDATE(),
            [Token] VARCHAR(255) NOT NULL,
            [Valid] VARCHAR(1) NOT NULL DEFAULT 'Y', -- For blacklisting
            CONSTRAINT FK_Tokens_Users FOREIGN KEY (UserId)
            REFERENCES [dbo].[Users] (Id),
            CONSTRAINT CHK_Valid CHECK (Valid IN ('Y', 'N'))
        );
        PRINT ('Created table [dbo].[RefreshTokens]');
    END

-- Success
PRINT('Completed setup of database [type_on_willie].[dbo].');
