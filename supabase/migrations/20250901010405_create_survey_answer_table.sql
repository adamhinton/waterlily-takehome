-- This is user's answers to survey questions
-- Each answer belongs to one survey_question
-- Each survey_question has multiple survey_answer from different users

-- id
-- user_id
-- survey_question_id
-- answer_text

DROP TABLE IF EXISTS survey_answer;
CREATE TABLE IF NOT EXISTS survey_answer (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    survey_question_id INTEGER NOT NULL REFERENCES survey_question(id) ON DELETE CASCADE,
    answer_text TEXT
);