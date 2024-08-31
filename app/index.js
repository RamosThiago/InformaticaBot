import { Client, IntentsBitField } from "discord.js";
import dotenv from "dotenv";
import { displayAdvertises } from "./SlashCommands/cartelera.js";

dotenv.config();
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log("Bot prendido");
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.commandName === "cartelera") {
    await interaction.deferReply();
    await displayAdvertises(interaction);
  }
});

// Comandos de texto
client.on("messageCreate", async (msg) => {
  if (msg.content.toLowerCase() === "ping") {
    msg.channel.sendTyping();
    msg.reply("pong");
  }
});

client.login(process.env.TOKEN);
