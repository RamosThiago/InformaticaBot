const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");
const updatePosts = require("./commands/utils/updatePosts.js");

dotenv.config();

// Inicializa los archivos json en caso de no estar creados
if (!fs.existsSync("./app/lastMessage.json")) {
  fs.writeFileSync(
    "./app/lastMessage.json",
    JSON.stringify({}, null, "\t"),
    "utf8"
  );
}

if (!fs.existsSync("./app/guilds.json")) {
  fs.writeFileSync("./app/guilds.json", JSON.stringify([], null, "\t"), "utf8");
}

const guilds = require("./guilds.json");
const lastDates = require("./lastMessage.json");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Guardo los servidores y ultimas fechas en el cliente
client.servers = guilds;
client.lastDates = lastDates;

// Actualiza las materias al encender el bot y despues cada 3 horas
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Bot ${readyClient.user.tag} iniciado`);

  await updatePosts();

  setInterval(async () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour > 0 && hour < 7) return;
    await updatePosts();
  }, 3 * 60 * 60 * 1000); // 3 horas
});

// Carga los comandos en el clienta para poder manejar las interacciones que lleguen
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    return;
  }

  if (interaction.isChatInputCommand()) {
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
    }
  } else if (interaction.isAutocomplete()) {
    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(error);
    }
  }
});

client.login(process.env.TOKEN);

module.exports = client;
