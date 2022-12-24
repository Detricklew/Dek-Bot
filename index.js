var log = require("./Load_discord.js");
// Require the necessary discord.js classes
const {
  Client,
  Events,
  GatewayIntentBits,
  SlashCommandStringOption,
  Guild,
} = require("discord.js");
const { token } = require("./config.json");

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
    server.channels.fetch().then((channel) => {
      channel.forEach((billy) => {
        if (billy.type == "0") {
          log.Load_Messages(billy);
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
  console.log(message.author.username);
  console.log(message.channel);
  console.log(message.createdAt);
  console.log(message.channel.name);
  console.log(message.content);
});

client.on("messageReactionAdd", async (MessageReaction, user) => {
  console.log(user);
  console.log(MessageReaction);
});

// Log in to Discord with your client's token
client.login(token);
