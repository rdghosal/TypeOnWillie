CREATE TABLE [type_on_willie].[sonnets]
(
	[sonnet_id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [sonnet_number] INT NOT NULL,
    [sonnet_title] VARCHAR(255) NOT NULL, 
    [sonnet_text] VARCHAR(255) NOT NULL
)
