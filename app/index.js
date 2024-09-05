const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  TextChannel,
  EmbedBuilder,
} = require("discord.js");
const dotenv = require("dotenv");
const { fetchAdvertises } = require("./commands/cartelera/fetchCartelera");
const { setTimeout } = require("node:timers/promises");

const cheerio = require("cheerio");
const guilds = require("./guilds.json");
const lastPosts = require("./lastMessage.json");

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
client.servers = guilds; // Guardo los servidores en guilds.json

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Bot ${readyClient.user.tag} iniciado`);

  setInterval(async () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour > 0 && hour < 7) return;

    for (let serverInfo of readyClient.servers) {
      const { serverid, canal: canalId, materias } = serverInfo;
      const server = await client.guilds.fetch(serverid);
      const canal = await server.channels.fetch(canalId);

      for (let materia of materias) {
        const lastPost = await fetchAdvertises(materia.id, 1);
        const isLast = lastPosts[materia.id] === lastPost.mensajes[0].cuerpo;
        if (isLast) continue;

        // Si hay un mensaje nuevo, actualizar el json
        lastPosts[materia.id] = lastPost.mensajes[0].cuerpo;
        fs.writeFileSync(
          "./app/lastMessage.json",
          JSON.stringify(lastPosts, null, "\t")
        );
        await canal.send({
          embeds: [makeEmbed(lastPost, materia.id)],
        });
        await setTimeout(1000);
      }
    }
  }, 3 * 60 * 60 * 1000); // 3 horas
});

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

function makeEmbed(info, id) {
  const [mensaje] = info.mensajes;
  const cuerpoTexto = cheerio.load(mensaje.cuerpo).text();
  let adjuntosTexto = "";

  if (mensaje.adjuntos && mensaje.adjuntos.length > 0) {
    adjuntosTexto = mensaje.adjuntos
      .map((adj) => `[${adj.nombre}](${adj.public_path})`)
      .join("\n");
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${mensaje.materia}`,
      iconURL: "https://gestiondocente.info.unlp.edu.ar/favicon.png",
      url: `https://gestiondocente.info.unlp.edu.ar/cartelera/#form[materia]=&${id}`,
    })
    .setTitle(
      `${mensaje.is_anulado ? `~~${mensaje.titulo}~~` : `${mensaje.titulo}`}`
    )
    .setDescription(
      `${
        mensaje.is_anulado
          ? `~~${cuerpoTexto} \n\n ${adjuntosTexto}~~`
          : `${cuerpoTexto} \n\n ${adjuntosTexto}`
      }`
    )
    .setColor("#a30a16")
    .setFooter({
      text: `${
        mensaje.is_anulado
          ? ` ${`Publicado por ${mensaje.autor.trim()} el ${
              mensaje.fecha
            } y anulado el ${new Date(
              mensaje.fecha_anulacion
            ).toLocaleDateString()}`}`
          : `${`Publicado por ${mensaje.autor.trim()} el ${mensaje.fecha}`}`
      }`,
    });

  return embed;
}
