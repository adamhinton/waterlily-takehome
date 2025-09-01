-- Seed one survey with id 1. Make it have id 1
INSERT INTO survey (id, title, description) VALUES (1, 'Waterlily Intake Survey', 'We are colecting basic information to feed to our AI model to best plan your care');


-- Seed three survey_questions that belong to that survey
-- very basic questions -- name, email, phone number
INSERT INTO survey_question (survey_id, title, question_text, question_type, is_required, min, max, question_order) VALUES
(1, 'Full Name', 'What is your full name?', 'short_text', TRUE, 1, 100, 1),
(1, 'Email Address', 'What is your email address?', 'email', TRUE, 5, 100, 2),
(1, 'Phone Number', 'What is your phone number?', 'phone', FALSE, 10, 15, 3);