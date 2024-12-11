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



-- WITH messages_for_channel AS (
--     SELECT id AS message_id, body, replies_to, time_posted, user_id
--     FROM messages WHERE channel_id = ? AND replies_to IS NULL 
-- )
-- WITH messages_with_username AS (
--     SELECT messages_for_channel.id AS message_id, body, replies_to, 
--     time_posted, user_id, users.name AS user_name
--     FROM messages_for_channel JOIN users WHERE 
--     messages_for_channel.user_id = users.id 
-- )
-- WITH messages_with_replies AS (
--     SELECT replies_to AS message_id, COUNT(replies_to) AS reply_count
--     FROM messages WHERE replies_to NOT NULL GROUP BY replies_to
-- )
-- SELECT messages_with_username.message_id, messages_with_username.body, 
-- messages_with_replies.reply_count, messages_with_username.user_id, messages_with_username.user_name
-- messages_with_username.time_posted
-- FROM messages_with_username LEFT JOIN messages_with_replies WHERE
-- messages_with_username.message_id = messages_with_replies.message_id
-- ORDER BY time_posted ASC 


-- WITH messages_for_channel AS (
-- SELECT id AS message_id, body, replies_to, time_posted, user_id 
-- FROM messages WHERE channel_id = 1 AND replies_to IS NULL 
-- ),
-- messages_with_username AS (
--     SELECT messages_for_channel.message_id, body, replies_to, 
--     time_posted, user_id, users.name AS user_name
--     FROM messages_for_channel JOIN users WHERE 
--     messages_for_channel.user_id = users.id 
-- ),
-- messages_with_replies AS (
--     SELECT replies_to AS message_id, COUNT(replies_to) AS reply_count
--     FROM messages WHERE replies_to NOT NULL GROUP BY replies_to
-- )
-- SELECT messages_with_username.message_id, messages_with_username.body, 
-- messages_with_replies.reply_count, messages_with_username.user_id, messages_with_username.user_name,
-- messages_with_username.time_posted
-- FROM messages_with_username LEFT JOIN messages_with_replies ON
-- messages_with_username.message_id = messages_with_replies.message_id
-- ORDER BY time_posted ASC 


WITH channels_with_user AS (
                SELECT channels.id AS channel_id, channels.name AS channel_name,
                user_channel_seen.last_seen
                FROM channels JOIN user_channel_seen ON 
                channels.id = user_channel_seen.channel_id AND 
                user_channel_seen.user_id = 1
            ), 
            channels_with_messages AS (
                SELECT channels_with_user.channel_id, channels_with_user.last_seen, 
                messages.id AS message_id, messages.time_posted 
                FROM channels_with_user LEFT JOIN messages ON 
                messages.channel_id = channels_with_user.channel_id
            ),
            channels_with_unread_messages AS (
                SELECT * FROM channels_with_messages WHERE 
                channels_with_messages.time_posted is NULL 
                OR channels_with_messages.last_seen < channels_with_messages.time_posted
            ),
            channel_with_unread_count AS (
                SELECT channels_with_unread_messages.channel_id AS channel_id, 
                COUNT(channels_with_unread_messages.message_id) as unread_count 
                FROM channels_with_unread_messages 
                GROUP BY channels_with_unread_messages.channel_id
            )
            SELECT channels.name AS channel_name, channels.id AS channel_id, 
            channel_with_unread_count.unread_count 
            FROM channels JOIN channel_with_unread_count ON
            channels.id = channel_with_unread_count.channel_id


WITH messages_for_channel AS (
            SELECT id AS message_id, body, replies_to, time_posted, user_id
            FROM messages WHERE channel_id = 1 AND replies_to IS NULL 
            ),
            messages_with_username AS (
                SELECT messages_for_channel.message_id, body, replies_to, 
                time_posted, user_id, users.name AS user_name
                FROM messages_for_channel JOIN users ON 
                messages_for_channel.user_id = users.id 
            ),
            messages_with_replies AS (
                SELECT replies_to AS message_id, COUNT(replies_to) AS reply_count
                FROM messages WHERE replies_to NOT NULL GROUP BY replies_to
            ),
            messages_with_reply_count AS (
                SELECT messages_with_username.message_id, messages_with_username.body, 
                CASE WHEN messages_with_replies.reply_count IS NULL THEN 0
                ELSE messages_with_replies.reply_count END AS reply_count
                , messages_with_username.user_id, messages_with_username.user_name,
                messages_with_username.time_posted
                FROM messages_with_username LEFT JOIN messages_with_replies ON
                messages_with_username.message_id = messages_with_replies.message_id
            ),
            messages_with_reactions AS (
                SELECT messages_with_reply_count.message_id, messages_with_reply_count.body, 
                messages_with_reply_count.reply_count, messages_with_reply_count.user_id,
                messages_with_reply_count.user_name, messages_with_reply_count.time_posted, 
                emoji, reactions.user_id AS reaction_user_id FROM 
                messages_with_reply_count LEFT JOIN reactions ON
                messages_with_reply_count.message_id = reactions.message_id
            ),
            messages_with_reactions_and_usernames AS (
                SELECT messages_with_reactions.message_id, messages_with_reactions.body,
                messages_with_reactions.reply_count, messages_with_reactions.user_id,
                messages_with_reactions.user_name, messages_with_reactions.time_posted,
                messages_with_reactions.emoji, users.name AS reaction_user_name
                FROM messages_with_reactions LEFT JOIN users ON
                messages_with_reactions.reaction_user_id = users.id
            )
            SELECT * FROM messages_with_reactions_and_usernames;







            WITH channels_with_user AS (
                SELECT channels.id AS channel_id, channels.name AS channel_name,
                user_channel_seen.last_seen
                FROM channels JOIN user_channel_seen ON 
                channels.id = user_channel_seen.channel_id AND 
                user_channel_seen.user_id = 4
            ), 
            channels_with_messages AS (
                SELECT channels_with_user.channel_id, channels_with_user.last_seen, 
                messages.id AS message_id, messages.time_posted 
                FROM channels_with_user LEFT JOIN messages ON 
                messages.channel_id = channels_with_user.channel_id
            ),
            channels_with_unread_messages AS (
                SELECT * FROM channels_with_messages WHERE 
                channels_with_messages.time_posted is NULL 
                OR channels_with_messages.last_seen < channels_with_messages.time_posted
            ),
            channel_with_unread_count AS (
                SELECT channels_with_unread_messages.channel_id AS channel_id, 
                COUNT(channels_with_unread_messages.message_id) as unread_count 
                FROM channels_with_unread_messages 
                GROUP BY channels_with_unread_messages.channel_id
            )
            SELECT channels.name AS channel_name, channels.id AS channel_id, 
            CASE WHEN channel_with_unread_count.unread_count is NULL THEN 0 
            ELSE channel_with_unread_count.unread_count END AS unread_count
            FROM channels LEFT JOIN channel_with_unread_count ON
            channels.id = channel_with_unread_count.channel_id


                        