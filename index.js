const { Client, GatewayIntentBits, Partials } = require("discord.js");

// Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// Bot ready event
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Example message command
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    message.reply("🏓 Pong!");
  }
});

// Login using Railway environment variable
client.login(process.env.TOKEN);
