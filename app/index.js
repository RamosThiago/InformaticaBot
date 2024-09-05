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

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
client.servers = guilds; // Guardo los servidores en guilds.json

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Bot ${readyClient.user.tag} iniciado`);

  await searchNewPosts(readyClient);

  setInterval(async () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour > 0 && hour < 7) return;
    await searchNewPosts(readyClient);
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

function makeEmbed(mensaje, id) {
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

function convertirFecha(fecha) {
  if (!fecha) return null;
  const [dia, mes, año, hora, minuto] = fecha.match(/\d+/g);
  return new Date(`${año}-${mes}-${dia}T${hora}:${minuto}:00`);
}

const searchNewPosts = async (readyClient) => {
  for (let serverInfo of readyClient.servers) {
    const { serverid, canal: canalId, materias } = serverInfo;

    // Try-catch por si el canal o servidor guardado ya se borro
    try {
      const server = await client.guilds.fetch(serverid);
      const canal = await server.channels.fetch(canalId);

      if (!canalId || materias.length === 0) continue;

      for (let materia of materias) {
        const lastPosts = await fetchAdvertises(materia.id, 5);

        // Pasa al siguiente si hay un error en fetchAdvertises, si la materia no tiene mensajes o si el mensaje vino sin fecha
        if (
          !lastPosts ||
          !lastPosts.mensajes ||
          lastPosts.mensajes.length === 0 ||
          !lastPosts.mensajes[0].fecha
        )
          continue;

        const lastPostDate = convertirFecha(lastPosts.mensajes[0].fecha);
        const previousPostDate = convertirFecha(lastDates[materia.id]);

        const isLast =
          previousPostDate &&
          lastPostDate &&
          previousPostDate.getTime() === lastPostDate.getTime();

        if (isLast) continue;

        // Si hay un mensaje nuevo, actualizar el json
        lastDates[materia.id] = lastPosts.mensajes[0].fecha;

        fs.writeFileSync(
          "./app/lastMessage.json",
          JSON.stringify(lastDates, null, "\t")
        );

        lastPosts.mensajes.forEach(async (post) => {
          const actualPostDate = convertirFecha(post.fecha);
          if (
            !previousPostDate ||
            !actualPostDate ||
            actualPostDate.getTime() > previousPostDate.getTime()
          ) {
            await canal.send({
              embeds: [makeEmbed(post, materia.id)],
            });
          }
        });

        console.log(
          `Se actualizo ${materia.name} en ${canal.name} (${server.name})`
        );

        await setTimeout(1000);
      }
    } catch (error) {
      console.error(
        `Error obteniendo canal o servidor (GuildID ${serverid}): ${error.message}`
      );
      continue;
    }
  }
};
