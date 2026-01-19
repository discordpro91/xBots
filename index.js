const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  AuditLogEvent
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel]
});

const LOG_CHANNEL_ID = "1462677393381658750";

function sendLog(guild, embed) {
  const channel = guild.channels.cache.get(LOG_CHANNEL_ID);
  if (channel) channel.send({ embeds: [embed] }).catch(() => {});
}

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageDelete", async (message) => {
  if (!message.guild || message.author?.bot) return;

  const embed = new EmbedBuilder()
    .setTitle("🗑 Message Deleted")
    .setColor("Red")
    .addFields(
      { name: "User", value: `${message.author}`, inline: true },
      { name: "Channel", value: `${message.channel}`, inline: true },
      { name: "Content", value: message.content || "*No content*" }
    )
    .setTimestamp();

  sendLog(message.guild, embed);
});

client.on("messageUpdate", async (oldMsg, newMsg) => {
  if
}
