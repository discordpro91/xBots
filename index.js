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
  if (channel) {
    channel.send({ embeds: [embed] }).catch(() => {});
  }
}

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

/* 
  BOT ONLINE – ADD EVENTS BELOW
*/
client.on("messageDelete", (message) => {
  if (!message.guild) return;
  if (!message.author) return;

  const logChannel = message.guild.channels.cache.get(LOG_CHANNEL_ID);
  if (!logChannel) return;

  logChannel.send({
    content:
      `🗑 **Message Deleted**\n` +
      `User: ${message.author.tag}\n` +
      `Channel: ${message.channel}\n` +
      `Content: ${message.content || "*No content*"}`
  }).catch(() => {});
});
client.on("messageUpdate", (oldMsg, newMsg) => {
  if (!newMsg.guild) return;
  if (!oldMsg.author) return;
  if (oldMsg.content === newMsg.content) return;

  const logChannel = newMsg.guild.channels.cache.get(LOG_CHANNEL_ID);
  if (!logChannel) return;

  logChannel.send({
    content:
      `✏ **Message Edited**\n` +
      `User: ${oldMsg.author.tag}\n` +
      `Channel: ${oldMsg.channel}\n\n` +
      `**Before:**\n${oldMsg.content || "*Empty*"}\n\n` +
      `**After:**\n${newMsg.content || "*Empty*"}`
  }).catch(() => {});
});

client.on("guildBanAdd", async (ban) => {
  const guild = ban.guild;

  let executor = "Unknown";
  let reason = "No reason provided";

  try {
    const logs = await guild.fetchAuditLogs({
      type: AuditLogEvent.MemberBanAdd,
      limit: 1
    });

    const entry = logs.entries.first();
    if (entry) {
      if (entry.executor) executor = entry.executor.tag;
      if (entry.reason) reason = entry.reason;
    }
  } catch (err) {
    console.error("Audit log error:", err);
  }

  const logChannel = guild.channels.cache.get(LOG_CHANNEL_ID);
  if (!logChannel) return;

  logChannel.send({
    content:
      "🔨 **Member Banned**\n" +
      "User: " + ban.user.tag + "\n" +
      "Moderator: " + executor + "\n" +
      "Reason: " + reason
  }).catch(() => {});
});


client.login(process.env.TOKEN);
