CREATE TABLE sleeptime_data(
    id SERIAL PRIMARY KEY,
    data_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    bed_time TIMESTAMPTZ DEFAULT now() NOT NULL,
    wakeup_time TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id INTEGER REFERENCES sleeptime_users(id) ON DELETE CASCADE NOT NULL
);



