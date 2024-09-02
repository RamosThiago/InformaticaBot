const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { materiasData } = require("../cartelera/fetchCartelera.js");
const { readFile, writeFile } = require("node:fs").promises;

async function canalActual(interaction) {
  const guildid = interaction.guildId;

  try {
    const guilds = await readFile("./app/guilds.json", "utf8");
    const jsonObject = JSON.parse(guilds);

    const server = jsonObject.find((x) => x.serverid === guildid);

    if (server && server.canal) {
      await interaction.editReply(`El canal actual es <#${server.canal}>`);
    } else {
      await interaction.editReply(
        "No hay canal de anuncios configurado en el servidor"
      );
    }
  } catch (error) {
    console.log("Error en el comando canal actual: " + error);
    interaction.editReply("Ocurrió un error al mostrar el canal actual");
    throw error;
  }
}

async function agregarCanal(interaction) {
  const canalid = interaction.options.getChannel("canal").id;
  const guildid = interaction.guildId;

  try {
    const guilds = await readFile("./app/guilds.json", "utf8");
    const jsonObject = JSON.parse(guilds);

    const server = jsonObject.find((x) => x.serverid === guildid);

    if (server) {
      if (server.canal === canalid) {
        await interaction.editReply(
          `El canal de anuncios ya está configurado en <#${canalid}>`
        );
        return;
      } else {
        server.canal = canalid;
      }
    } else {
      jsonObject.push({
        serverid: guildid,
        canal: canalid,
        materias: [],
      });
    }

    const changedJson = JSON.stringify(jsonObject, null, 2);
    await writeFile("./app/guilds.json", changedJson, "utf8");
    await interaction.editReply(`<#${canalid}> es el nuevo canal de anuncios`);
  } catch (error) {
    console.log("Error en el comando agregar canal: " + error);
    interaction.editReply("Ocurrió un error al agregar el canal");
    throw error;
  }
}

async function eliminarCanal(interaction) {
  const guildid = interaction.guildId;

  try {
    const guilds = await readFile("./app/guilds.json", "utf8");
    const jsonObject = JSON.parse(guilds);

    const server = jsonObject.find((x) => x.serverid === guildid);
    let serverBorrado;

    if (server && server.canal) {
      serverBorrado = server.canal;
      server.canal = null;
    } else if (!server || !server.canal) {
      await interaction.editReply(
        "No hay canal de anuncios configurado en el servidor"
      );
      return;
    }

    const changedJson = JSON.stringify(jsonObject, null, 2);
    await writeFile("./app/guilds.json", changedJson, "utf8");
    await interaction.editReply(
      `Se elimino como canal de anuncios a <#${serverBorrado}>`
    );
  } catch (error) {
    console.log("Error en el comando eliminar canal: " + error);
    interaction.editReply("Ocurrió un error al eliminar el canal");
    throw error;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anuncios")
    .setDescription("Manejar el canal de anuncios del servidor")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("actual")
        .setDescription("Mostrar el canal actual de anuncios")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("agregar")
        .setDescription("Agregar o sustituir el canal de anuncios")
        .addChannelOption((option) =>
          option
            .setName("canal")
            .setDescription("Nombre de la materia")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("eliminar")
        .setDescription("Eliminar el canal de anuncios")
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "agregar") {
      await agregarCanal(interaction);
    } else if (subcommand === "eliminar") {
      await eliminarCanal(interaction);
    } else if (subcommand === "actual") {
      await canalActual(interaction);
    } else {
      await interaction.editReply({
        content: "Ocurrió un error",
        ephemeral: true,
      });
    }
  },
};
