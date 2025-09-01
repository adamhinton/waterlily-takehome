-- This is the main survey table
-- Note that a survey's actual questions are stored in the survey_question table
-- Each survey has multiple questions1

-- 
-- survey table
-- id 
-- title
-- description

DROP TABLE IF EXISTS survey;
CREATE TABLE IF NOT EXISTS survey (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
);