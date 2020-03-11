BEGIN;

INSERT INTO sleeptime_users(user_name, user_age, password)
VALUES
('dunder', 2, 'dunderpass'),
('John', 3, 'johnpass'),
('Amy', 1, 'amypass');

INSERT INTO sleeptime_data(data_created, bed_time, wakeup_time, user_id)
VALUES
('2020-02-22 19:10:25-07', '2020-02-22 23:10:25-07', '2020-02-23 05:10:25-07', 1),
('2020-02-22 19:10:25-07', '2020-02-22 21:10:25-07', '2020-02-22 06:10:25-07', 2),
('2020-02-22 19:10:25-07', '2020-02-22 22:10:25-07', '2020-02-22 08:10:25-07', 3);

COMMIT;

