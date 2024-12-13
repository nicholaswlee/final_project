import string
import random
import time
from datetime import datetime
from flask import Flask, g, request
from functools import wraps
import sqlite3
import os
from flask_cors import CORS


app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
CORS(app)

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect('db/belay.sqlite3')
        db.row_factory = sqlite3.Row
        setattr(g, '_database', db)
    return db

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('db/20241213_create_tables.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def query_db(query, args=(), one=False):
    db = get_db()
    cursor = db.execute(query, args)
    rows = cursor.fetchall()
    db.commit()
    cursor.close()
    if rows:
        if one: 
            return rows[0]
        return rows
    return None

def new_user(name=None, password=None):
    name = name if name else "Unnamed User #" + ''.join(random.choices(string.digits, k=6))
    password = password if name else ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
    api_key = ''.join(random.choices(string.ascii_lowercase + string.digits, k=40))
    u = query_db('insert into users (name, password, api_key) ' + 
        'values (?, ?, ?) returning id, name, password, api_key',
        (name, password, api_key),
        one=True)
    return u

def get_user_from_api_token(request):
    api_key = request.headers.get('Authorization')
    print(api_key)
    api_key = api_key.split(' ')[-1] if api_key else None
    if api_key:
        return query_db('SELECT * FROM users WHERE api_key = ?', [api_key], one=True)
    return None

def is_invalid_api_token(user, request):
    api_key = request.headers.get('Authorization')
    api_key = api_key.split(' ')[-1] if api_key else None
    api_key = api_key if api_key else None
    if api_key:
        return user['api_key'] != api_key
    return True

def retrieve_user_from_username_and_password(username, password):
    return query_db('SELECT * FROM users WHERE name = ? AND password = ?', [username, password], one=True)

def is_valid_username(name):
    user_with_username = query_db('SELECT * FROM users WHERE name = ?', [name], one=True)
    if user_with_username:
        return False
    return True 

def is_valid_channel_name(name):
    channel_with_name = query_db('SELECT * FROM channels WHERE name = ?', [name], one=True)
    if channel_with_name:
        return False
    return True 
    

@app.route("/api/user/login", methods=['POST'])
def login():
    data = request.json
    user = retrieve_user_from_username_and_password(data['name'], data['password'])
    if user:
        return {"api_key": user["api_key"], "user_id": user['id'], "name": user["name"]}, 200
    else: 
        return {"message": "Invalid username or password"}, 403

@app.route("/api/user/signup", methods=['POST'])
def signup():
    print("signup")
    user = get_user_from_api_token(request)
    data = request.json
    if user:
        return {"api_key": user["api_key"], "message": "You are already signed in"}, 403
    if not is_valid_username(data['name']):
        return {"message": "Invalid username"}, 409
    user = new_user(name=data['name'], password=data['password'])
    api_key = user['api_key']
    user_id = user['id']
    user_name = user['name']
    users = query_db('SELECT id FROM users')
    # Add last seen entry as current time for all messages in this channel
    channels = query_db('SELECT id FROM channels')
    for channel in channels: 
        query_db('INSERT INTO user_channel_seen (user_id, channel_id, last_seen)' + 
                 'values (?, ?, ?)', (channel["id"], user['id'], 0))
    return {"api_key": api_key, "user_id": user_id, "name": user_name}, 200

@app.route("/api/user", methods=['GET'])
def get_user():
    user = get_user_from_api_token(request)
    if not user or is_invalid_api_token(user, request):
        return {"message": "Invalid token or user does not exist"}, 403
    return {"name": user['name'], "user_id" : user['id']}, 200 

@app.route("/api/user/password", methods=['POST'])
def update_user_password():
    user = get_user_from_api_token(request)
    if not user or is_invalid_api_token(user, request):
        return {"message": "Invalid token or user does not exist"}, 403
    password = request.json['password']
    query_db('UPDATE users SET password = ? where id = ?', [password, user['id']])
    return {"message": "Succesfully changed password"}, 200

@app.route("/api/user/name", methods=['POST'])
def update_user_name():
    user = get_user_from_api_token(request)
    if not user or is_invalid_api_token(user, request):
        return {"message": "Invalid token or user does not exist"}, 403
    # Get the new name from the request json
    name = request.json['name']
    if not is_valid_username(name):
        return {"message": f"Username {name} is taken"}, 400
    query_db('UPDATE users SET name = ? where id = ?', [name, user['id']])
    return {"message": f"Username was succesfully changed to {name}"}, 200 

@app.route("/api/channels", methods=['GET'])
def get_channels():
    user = get_user_from_api_token(request)
    if not user or is_invalid_api_token(user, request):
        return {"message": "Invalid token or user does not exist"}, 403 
    user_id = user["id"]
    channels = query_db("""
            WITH channels_with_user AS (
                SELECT channels.id AS channel_id, channels.name AS channel_name,
                user_channel_seen.last_seen
                FROM channels JOIN user_channel_seen ON 
                channels.id = user_channel_seen.channel_id AND 
                user_channel_seen.user_id = ?
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
            """, [user_id])
    channel_results = []
    if not channels:
        channels = []
    for channel in channels:
        channel_results.append(
            {
                "channel_id" : channel["channel_id"],
                "channel_name" : channel["channel_name"],
                "unread_count" : channel["unread_count"]
            }
        )
    return channel_results, 200

# TODO Add decorator?

@app.route("/api/channels", methods=['POST'])
def create_channel():
    user = get_user_from_api_token(request)
    if not user or is_invalid_api_token(user, request):
        return {"message": "Invalid token or user does not exist"}, 403 
    name = request.json["name"]
    if not is_valid_channel_name(name):
        return {"message": "This channel name already exists"}, 409
    current_time = int(time.time())
    channel = query_db('INSERT INTO channels (name) ' + 
        'values (?) returning id, name',
        [name], one=True)
    channel_id = channel['id']
    users = query_db('SELECT id FROM users')
    # Add last seen entry as current time for all messages in this channel
    for user in users: 
        query_db('INSERT INTO user_channel_seen (user_id, channel_id, last_seen)' + 
                 'values (?, ?, ?)', (channel_id, user['id'], current_time))
    return {"channel_id": channel_id}, 200

# TODO: Support emojis
@app.route("/api/channels/<int:channel_id>/messages", methods=['GET'])
def get_messages_for_channel(channel_id):
    user = get_user_from_api_token(request)
    if not user or is_invalid_api_token(user, request):
        return {"message": "Invalid token or user does not exist"}, 403  
    channel = query_db("SELECT * FROM channels WHERE id = ?",
                        [channel_id], one=True)
    if not channel:
        return {"message": "Channel does not exist"}, 403
    messages = query_db("""
            WITH messages_for_channel AS (
            SELECT id AS message_id, body, replies_to, time_posted, user_id
            FROM messages WHERE channel_id = ? AND replies_to IS NULL 
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
            SELECT * FROM messages_with_reactions_and_usernames
            """, [channel_id]
    )
    message_results = []
    message_results_inner = {}
    if not messages:
        messages = []
    for message in messages: 
        if message["message_id"] not in message_results_inner:
            message_results_inner[message["message_id"]] = {
                "message_id" : message["message_id"],
                "body":  message["body"],
                "reply_count" : message["reply_count"],
                "user_id" : message["user_id"],
                "user_name" : message["user_name"],
                "time_posted": message["time_posted"],
                "reactions": {}
            }
        if message["emoji"]:
            message_results_inner[message["message_id"]]["reactions"][message["emoji"]] = \
                message_results_inner[message["message_id"]]["reactions"].get(message["emoji"], []) + [message["reaction_user_name"]]

    message_results = sorted(list(message_results_inner.values()), key=lambda x: x["time_posted"])
    current_time = int(time.time())
    query_db('UPDATE user_channel_seen SET last_seen = ? where user_id = ? AND channel_id = ?',
             [current_time, user['id'], channel_id])
    return message_results

@app.route("/api/channels/<int:channel_id>/messages", methods=['POST'])
def post_message_to_channel(channel_id):
    user = get_user_from_api_token(request)
    if not user or is_invalid_api_token(user, request):
        return {"message": "Invalid token or user does not exist"}, 403 
    channel = query_db("SELECT * FROM channels WHERE id = ?",
                        [channel_id], one=True)
    if not channel:
        return {"message": "Channel does not exist"}, 403
    body = request.json["body"]
    current_time = int(time.time())
    # TODO: Figure out replies to
    message = query_db('INSERT INTO messages (user_id, channel_id, replies_to, body, time_posted)' +
             'values (?, ?, ?, ?, ?) returning id', 
             [user['id'], channel_id, None, body, current_time], one=True)
    return {"message_id" : message['id']}, 200 

@app.route("/api/channels/<int:channel_id>/messages/<int:message_id>", methods=['GET'])
def get_replies_to_message(channel_id, message_id):
    user = get_user_from_api_token(request)
    if not user or is_invalid_api_token(user, request):
        return {"message": "Invalid token or user does not exist"}, 403  
    message = query_db("SELECT * FROM messages WHERE channel_id = ? AND id = ?", 
                       [channel_id, message_id], one=True)
    if not message:
        return {"message": "The provided message/channel does not exist"}, 403
    replies = query_db("""
                       WITH message_replies AS (
                            SELECT messages.id AS message_id, messages.body,
                            messages.user_id, users.name AS user_name, messages.time_posted 
                            FROM messages JOIN users ON 
                            replies_to = ? AND channel_id = ? AND users.id = messages.user_id 
                       ),
                        message_replies_with_reactions AS (
                            SELECT message_replies.message_id, message_replies.body,
                            message_replies.user_id, message_replies.user_name, message_replies.time_posted,
                            reactions.emoji, reactions.user_id AS reaction_user_id FROM
                            message_replies LEFT JOIN reactions ON
                            message_replies.message_id = reactions.message_id
                       ),
                        message_replies_with_reactions_and_usernames AS (
                            SELECT message_replies_with_reactions.message_id, message_replies_with_reactions.body,
                            message_replies_with_reactions.user_id, message_replies_with_reactions.user_name,
                            message_replies_with_reactions.time_posted, message_replies_with_reactions.emoji,
                            users.name AS reaction_user_name FROM
                            message_replies_with_reactions LEFT JOIN users ON
                            message_replies_with_reactions.reaction_user_id = users.id
                        )
                        SELECT * FROM message_replies_with_reactions_and_usernames
                       """, [message_id, channel_id])
    replies_response = []
    replies_response_inner = {}
    if not replies:
        replies = []
    for reply in replies:
        if reply["message_id"] not in replies_response_inner:
            replies_response_inner[reply["message_id"]] = {
                "body" : reply["body"],
                "message_id" : reply["message_id"],
                "user_id" : reply["user_id"],
                "user_name" : reply["user_name"],
                "time_posted": reply["time_posted"],
                "reactions": {}
            }
        if reply["emoji"]:
            replies_response_inner[reply["message_id"]]["reactions"][reply["emoji"]] = \
                replies_response_inner[reply["message_id"]]["reactions"].get(reply["emoji"], []) + [reply["reaction_user_name"]]
    replies_response = sorted(list(replies_response_inner.values()), key=lambda x: x["time_posted"])
    return replies_response

@app.route("/api/channels/<int:channel_id>/messages/<int:message_id>", methods=['POST'])
def post_reply_to_message(channel_id, message_id):
    user = get_user_from_api_token(request)
    if not user or is_invalid_api_token(user, request):
        return {"message": "Invalid token or user does not exist"}, 403
    message = query_db("SELECT * FROM messages WHERE channel_id = ? AND id = ?", 
                       [channel_id, message_id], one=True)
    if not message:
        return {"message": "The provided message/channel does not exist"}, 403
    current_time = int(time.time())
    body = request.json["body"]
    reply_id = query_db("""
                INSERT INTO messages (user_id, channel_id, replies_to, body, time_posted)
                values (?, ?, ?, ?, ?) returning id
                """,
                [user['id'], channel_id, message_id, body, current_time],
                one = True
                )
    return {"message_id": reply_id["id"]}, 200

@app.route("/api/channels/<int:channel_id>/messages/<int:message_id>/reactions", methods=['POST'])
def post_emoji_to_message(channel_id, message_id):
    user = get_user_from_api_token(request)
    if not user or is_invalid_api_token(user, request):
        return {"message": "Invalid token or user does not exist"}, 403
    message = query_db("SELECT * FROM messages WHERE channel_id = ? AND id = ?", 
                       [channel_id, message_id], one=True)
    if not message:
        return {"message": "The provided message/channel does not exist"}, 403
    emoji = request.json["emoji"]
    reaction = query_db("""
                INSERT INTO reactions (user_id, message_id, emoji)
                values (?, ?, ?) returning id
                """,
                [user['id'], message_id, emoji],
                one = True
                )
    return {"reaction_id": reaction["id"]}, 200

@app.route("/api/channels/<int:channel_id>/messages/<int:message_id>/reactions", methods=['DELETE'])
def delete_emoji_to_message(channel_id, message_id):
    user = get_user_from_api_token(request)
    if not user or is_invalid_api_token(user, request):
        return {"message": "Invalid token or user does not exist"}, 403
    message = query_db("SELECT * FROM messages WHERE channel_id = ? AND id = ?", 
                       [channel_id, message_id], one=True)
    if not message:
        return {"message": "The provided message/channel does not exist"}, 403
    emoji = request.json["emoji"]
    reaction = query_db("""
                DELETE FROM reactions WHERE user_id = ? AND message_id = ? AND emoji = ?
                """,
                [user['id'], message_id, emoji]
                )
    return {"message": "Reaction was deleted"}, 200

if __name__ == "__main__":
    if not os.path.exists('db/belay.sqlite3'):
        init_db()
    app.run()
    