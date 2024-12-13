create table users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(40) UNIQUE,
    password VARCHAR(40),
    api_key VARCHAR(40)
);

create table channels (
    id INTEGER PRIMARY KEY,
    name VARCHAR(40) UNIQUE
);

create table messages (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    channel_id INTEGER,
    replies_to INTEGER, -- TODO: determine if this is correct structure
    body TEXT,
    time_posted TIMESTAMP, -- TODO: determine if timestamp is truly a timestamp
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(channel_id) REFERENCES channels(id),
    FOREIGN KEY(replies_to) REFERENCES messages(id) -- TODO: Determine if this is legal
);

create table user_channel_seen(
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    channel_id INTEGER,
    last_seen TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES user(id),
    FOREIGN KEY(channel_id) REFERENCES channel(id)
);

create table reactions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    message_id INTEGER,
    emoji VARCHAR(10), -- TODO: determine how to store emoji,
    FOREIGN KEY(user_id) REFERENCES user(id)
    FOREIGN KEY(message_id) REFERENCES messages(id) 
);
