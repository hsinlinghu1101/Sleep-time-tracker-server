CREATE TABLE sleeptime_users(
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    user_age INTEGER NOT NULL,
    password TEXT NOT NULL
);