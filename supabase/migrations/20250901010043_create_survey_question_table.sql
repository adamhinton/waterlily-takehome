-- These are the questions for each survey
-- Each question belongs to one survey
-- Each survey has multiple survey_questions
-- Each survey_question has multiple survey_answer

DROP TABLE IF EXISTS survey_question;
CREATE TABLE IF NOT EXISTS survey_question (
    id SERIAL PRIMARY KEY,
    survey_id INTEGER NOT NULL REFERENCES survey(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(10) CHECK (question_type IN ('short_text', 'phone', 'email', 'date', 'number', 'long_text')) NOT NULL,
    min INTEGER, -- min value for numeric, min length for text
    max INTEGER, -- max value for numeric, max length for text
    question_order INTEGER NOT NULL, -- order of the question in the survey
    is_required BOOLEAN DEFAULT FALSE
);