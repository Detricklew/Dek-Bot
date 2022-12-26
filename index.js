var log = require("./Load_discord.js");
const { token } = require("./config.json");
const { Load_DB, Log_message, Load_Server, Log_Reaction, load_users } = require("./Load_discord.js");
// Require the necessary discord.js classes
const {
  Client,
  Events,
  GatewayIntentBits,
  SlashCommandStringOption,
  Guild,
} = require("discord.js");
Load_DB();
// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  c.guilds.cache.forEach((server) => {
    Load_Server(server);
    load_users(server);
    server.channels.fetch().then((channel) => {
      channel.forEach((channel) => {
        if (channel.type == "0") {
          channel.messages
          .fetch({ limit:1 })
          .then(message =>{
            message.forEach(message =>{
              Log_message(message);
              message.reactions.cache.forEach(reaction =>{
                var messagereaction = reaction;
                reaction.users
                .fetch()
                .then(user =>{
                  user.forEach(user =>{
                    Log_Reaction(user.id, messagereaction);
                  })
                })
              })
            })
          })
          log.Load_Messages(channel);
        }
      });
    });
    server.members
      .fetch()
      .then((members) => {
        members.forEach((member) => {
          console.log(
            member.user.username +
              " " +
              member.guild.id +
              " " +
              member.guild.name
          );
        });
      })
      .catch(console.error);
  });
});

client.on("messageCreate", async (message) => {
  Log_message(message);
});

client.on("messageReactionAdd", async (MessageReaction, user) => {
  Log_Reaction(user.id, MessageReaction);
  console.log(user.id);
  console.log(MessageReaction.emoji.name);
  console.log(MessageReaction.message.id);
});

// Log in to Discord with your client's token
client.login(token);
