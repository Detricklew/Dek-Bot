let sqlite3 = require("sqlite3").verbose();

async function Load_reactions(message, reactions){
  let db = new sqlite3.Database("./Dek-bot.db", (err) => {
    if (err) {
      return console.log(err);
    }
  });
  reactions.cache.forEach( reaction =>{
    var emoji = reaction.emoji.name;
    reaction.users
    .fetch()
    .then(user =>{
      user.forEach(user =>{
        db.get(
          `SELECT EXISTS
          (SELECT * FROM reaction
            WHERE user_id = ?
            AND messages_id = ?
            AND reaction = ?)`,
            [user.id, message, emoji],
            (err,rows) =>{
              if (err){
                console.error(err);
                return;
              }
              let check = Object.values(rows);
              if (check == "1"){
                return;
              }
              else{
                db.run(
                  `INSERT INTO reaction (
                    user_id,
                    messages_id,
                    reaction
                  )
                  VALUES(?, ?, ?)`,
                  [user.id, message, emoji],
                  err =>{
                    if (err){
                      console.error(err);
                      return;
                    }
                    return;
                  }
                )
              }

            }
        )
      })
    })
  })
}
function Log_messages(message) {
  const Channel_id = message.channelId;
  const User_id = message.author.id;
  const Message = message.content;
  const Guild_id = message.guildId;
  const Message_id = message.id;
  const time = message.createdTimestamp;
  let db = new sqlite3.Database("./Dek-bot.db", (err) => {
    if (err) {
      return console.log(err);
    }
  });
  db.get(
    `SELECT EXISTS
      (SELECT * FROM message
       WHERE user_id = ?
       AND channel_id = ?
       AND guild_id = ?
       AND id = ?
       AND timestamp = ?)`,
    [User_id, Channel_id, Guild_id, Message_id, time],
    (err, row) => {
      if (err) {
        return console.error(err);
      }
      let checks = Object.values(row);
      if (checks == "1") {
        return;
      } else {
        db.run(
          `INSERT INTO message (
            user_id,
            content,
            guild_id,
            channel_id,
            timestamp,
            id
          )
          VALUES(?,?,?,?,?,?)`,
          [User_id, Message, Guild_id, Channel_id, time, Message_id],
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
            return;
          }
        );
      }
    }
  );
}
var log = {
  
  Load_Server:  async function (server){
    const guild_id = server.id;
    const guild_name = server.name;
    let db = new sqlite3.Database("./Dek-bot.db", (err) => {
      if (err) {
        return console.log(err);
      }
    });
    db.get(
      `SELECT EXISTS(
        SELECT * FROM guilds
        WHERE id = ?
        AND name  = ?
        )`,
        [guild_id, guild_name], (err,row) =>{
          if(err){
            console.error(err);
          }
          let checks = Object.values(row);
          console.log("Checks1");
          console.log(checks);
          if(checks == "1"){
            return;
          }
          else{
            console.log("if passed");
            db.get(
              `SELECT EXISTS(
                SELECT * FROM guilds
                WHERE id = ?
                )`,[guild_id], (err1,row1) =>{
                  if (err){
                    console.error(err1);
                    return;
                  }
                  else{
                  let check = Object.values(row1);
                  console.log("checks2");
                  console.log(check);
                  if (check == "1"){
                    db.run(
                    `UPDATE guilds
                     SET name = ?
                     WHERE id = ?
                      `, [guild_name, guild_id], (err) =>{
                        if (err){
                          console.error(err);
                          return;
                        }
                        return;
                      }
                    )
                  }
                  else{
                    db.run(
                    `INSERT INTO 
                     guilds (id, name)
                     VALUES (?,?)`,
                     [guild_id, guild_name], (err) =>{
                      if (err){
                        console.error(err);
                        return;
                      }
                      return;
                     }
                    )
                  }
                  }
                })
          }
        }
    )
  },
  Load_DB: function () {
    let db = new sqlite3.Database("./Dek-bot.db", (err) => {
      if (err) {
        return console.log(err);
      } else {
        db.run(`CREATE TABLE IF NOT EXISTS "user" (
                    "id"	INTEGER NOT NULL UNIQUE,
                    "Username"	TEXT NOT NULL,
                    PRIMARY KEY("id")
                  )`);
        db.run(`CREATE TABLE IF NOT EXISTS "reaction" (
                    "user_id"	INTEGER NOT NULL,
                    "messages_id"	INTEGER NOT NULL,
                    "reaction"	TEXT NOT NULL,
                    FOREIGN KEY("messages_id") REFERENCES "message"("id"),
                    FOREIGN KEY("user_id") REFERENCES "user"("id")
                  )`);
        db.run(`CREATE TABLE IF NOT EXISTS "message" (
                      "user_id"	INTEGER NOT NULL,
                      "content"	TEXT,
                      "guild_id"	INTEGER NOT NULL,
                      "channel_id"	INTEGER NOT NULL,
                      "timestamp"	INTEGER NOT NULL,
                      "id"	INTEGER NOT NULL,
                      FOREIGN KEY("channel_id") REFERENCES "channels"("id"),
                      PRIMARY KEY("id"),
                      FOREIGN KEY("guild_id") REFERENCES "guilds"("id"),
                      FOREIGN KEY("user_id") REFERENCES "user"("id")
                    )`);
        db.run(`CREATE TABLE IF NOT EXISTS "guilds" (
                      "id"	INTEGER NOT NULL,
                      "name"	TEXT NOT NULL,
                      PRIMARY KEY("id")
                    )`);
        db.run(`CREATE TABLE IF NOT EXISTS "custom_responses" (
                      "user_id"	INTEGER NOT NULL,
                      "trigger"	TEXT NOT NULL,
                      "response"	TEXT NOT NULL,
                      "guild_id"	INTEGER NOT NULL,
                      "channel_exclusive"	INTEGER NOT NULL,
                      "channel_id"	INTEGER NOT NULL,
                      FOREIGN KEY("channel_id") REFERENCES "channels"("id"),
                      FOREIGN KEY("user_id") REFERENCES "user"("id"),
                      FOREIGN KEY("guild_id") REFERENCES "guilds"("id")
                    )`);
        db.run(`CREATE TABLE IF NOT EXISTS "channels" (
                      "id"	INTEGER NOT NULL,
                      "guild_id"	INTEGER NOT NULL,
                      "name"	TEXT NOT NULL,
                      PRIMARY KEY("id")
                    )`);
        console.log("Successfully loaded database 'Dek-bot'");
        return;
      }
    });
  },
  Log_message: async function (message) {
    const Channel_id = message.channelId;
    const User_id = message.author.id;
    const Message = message.content;
    const Guild_id = message.guildId;
    const Message_id = message.id;
    const time = message.createdTimestamp;
    let db = new sqlite3.Database("./Dek-bot.db", (err) => {
      if (err) {
        return console.log(err);
      }
    });
    db.get(
      `SELECT EXISTS (SELECT
        * FROM message WHERE user_id = ?
         AND channel_id = ?
         AND guild_id = ?
         AND id = ?
         AND timestamp = ?)`,
      [User_id, Channel_id, Guild_id, Message_id, time],
      (err, row) => {
        if (err) {
          return console.error(err);
        }
        let checks = Object.values(row);
        if (checks == "1") {
          return;
        } else {
          db.run(
            `INSERT INTO message (
              user_id,
              content,
              guild_id,
              channel_id,
              timestamp,
              id
            )
            VALUES(?,?,?,?,?,?)`,
            [User_id, Message, Guild_id, Channel_id, time, Message_id],
            (err) => {
              if (err) {
                console.log(err);
                return;
              }
              return;
            }
          );
        }
      }
    );
  },
  Load_Messages: async function (channel_id) {
    const channel = channel_id;
    let messages = [];
    // Create message pointer
    let message = await channel.messages
      .fetch({ limit: 1 })
      .then((messagePage) =>
        messagePage.size === 1 ? messagePage.at(0) : null
      );

    while (message) {
      await channel.messages
        .fetch({ limit: 100, before: message.id })
        .then((messagePage) => {
          messagePage.forEach((msg) => messages.push(msg));

          // Update our message pointer to be last message in page of messages
          message =
            0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
        });
    };

    messages.forEach((message) => {
      Log_messages(message);
      Load_reactions(message.id, message.reactions);
    });
    // Print all messages
  },
};
module.exports = log;
