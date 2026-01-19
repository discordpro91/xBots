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

const LOG_CHANNEL_ID = "1461327478256697354";

function sendLog(guild, embed) {
  const channel = guild.channels.cache.get(LOG_CHANNEL_ID);
  if (channel) channel.send({ embeds: [embed] }).catch(() => {});
}

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

//
// 🗑 MESSAGE DELETE
//
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

//
// ✏ MESSAGE EDIT
//
client.on("messageUpdate", async (oldMsg, newMsg) => {
  if (!newMsg.guild || oldMsg.author?.bot) return;
  if (oldMsg.content === newMsg.content) return;

  const embed = new EmbedBuilder()
    .setTitle("✏ Message Edited")
    .setColor("Orange")
    .addFields(
      { name: "User", value: `${oldMsg.author}`, inline: true },
      { name: "Channel", value: `${oldMsg.channel}`, inline: true },
      { name: "Before", value: oldMsg.content || "*Empty*" },
      { name: "After", value: newMsg.content || "*Empty*" }
    )
    .setTimestamp();

  sendLog(newMsg.guild, embed);
});

//
// 🔨 MEMBER BAN
//
client.on("guildBanAdd", async (ban) => {
  const logs = await ban.guild.fetchAuditLogs({
    type: AuditLogEvent.MemberBanAdd,
    limit: 1
  });

  const log = logs.entries.first();

  const embed = new EmbedBuilder()
    .setTitle("🔨 Member Banned")
    .setColor("DarkRed")
    .addFields(
      { name: "User", value: `${ban.user}` },
      { name: "Moderator", value: log?.executor ? `${log.executor}` : "Unknown" },
      { name: "Reason", value: log?.reason || "No reason provided" }
    )
    .setTimestamp();

  sendLog(ban.guild, embed);
});

//
// 👢 MEMBER KICK
//
client.on("guildMemberRemove", async (member) => {
  const logs = await member.guild.fetchAuditLogs({
    type: AuditLogEvent.MemberKick,
    limit: 1
  });

  const log = logs.entries.first();

  if (!log || log.target.id !== member.id) return;

  const embed = new EmbedBuilder()
    .setTitle("👢 Member Kicked")
    .setColor("Purple")
    .addFields(
      { name: "User", value: `${member.user}` },
      { name: "Moderator", value: `${log.executor}` },
      { name: "Reason", value: log.reason || "No reason provided" }
    )
    .setTimestamp();

  sendLog(member.guild, embed);
});

client.login(process.env.TOKEN);
