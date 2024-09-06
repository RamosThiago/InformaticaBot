const { SlashCommandBuilder, CommandInteraction } = require("discord.js");
const materiasData = require("../cartelera/materiasData.json");
const { writeFile } = require("node:fs").promises;
const guilds = require("../../guilds.json");

async function agregarMateria(interaction, client) {
  const materiaid = interaction.options.getString("materia");
  const nombre = materiasData.find((m) => m.id == materiaid)
    ? materiasData.find((m) => m.id == materiaid).name
    : null;

  if (nombre) {
    const guildid = interaction.guildId;

    try {
      const { servers: guilds } = client;

      const server = guilds.find((x) => x.serverid === guildid);

      if (server) {
        const materiaExists = server.materias.some(
          (materia) => materia.id === materiaid
        );
        if (!materiaExists) {
          server.materias.push({ id: materiaid, name: nombre });
        } else {
          await interaction.editReply(
            `La materia ${nombre} ya está en la lista de anuncios`
          );
          return;
        }
      } else {
        guilds.push({
          serverid: guildid,
          canal: {},
          materias: [{ id: materiaid, name: nombre }],
        });
      }

      await writeFile(
        "./app/guilds.json",
        JSON.stringify(guilds, null, "\t"),
        "utf8"
      );
      await interaction.editReply(`Se agrego ${nombre} a la lista de materias`);
    } catch (error) {
      console.log("Error en el comando agregar: " + error);
      interaction.editReply("Ocurrió un error al agregar la materia");
      throw error;
    }
  } else {
    await interaction.editReply({
      content: "La materia ingresada no es valida",
      ephemeral: true,
    });
    return;
  }
}

async function eliminarMateria(interaction, client) {
  const materiaid = interaction.options.getString("materia");
  const nombre = materiasData.find((m) => m.id == materiaid)
    ? materiasData.find((m) => m.id == materiaid).name
    : null;

  if (nombre) {
    const guildid = interaction.guildId;

    try {
      const { servers: guilds } = client;

      const server = guilds.find((x) => x.serverid === guildid);

      if (server) {
        const materiaIndex = server.materias.findIndex(
          (materia) => materia.id === materiaid
        );
        if (materiaIndex !== -1) {
          server.materias.splice(materiaIndex, 1);
        } else {
          await interaction.editReply(
            `La materia ${nombre} no esta en la lista de anuncios`
          );
          return;
        }
      } else {
        await interaction.editReply(
          `No hay materias en la lista del servidor.`
        );
        return;
      }

      await writeFile(
        "./app/guilds.json",
        JSON.stringify(guilds, null, "\t"),
        "utf8"
      );
      await interaction.editReply(
        `Se elimino ${nombre} de la lista de materias`
      );
    } catch (error) {
      console.log("Error en el comando eliminar: " + error);
      interaction.editReply("Ocurrió un error al eliminar la materia");
      throw error;
    }
  } else {
    await interaction.editReply({
      content: "La materia ingresada no es valida",
      ephemeral: true,
    });
    return;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lista")
    .setDescription("Lista con las materias que se van a anunciar")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("mostrar")
        .setDescription("Mostrar la lista de materias del servidor")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("agregar")
        .setDescription("Agregar una materia a la lista")
        .addStringOption((option) =>
          option
            .setName("materia")
            .setDescription("Nombre de la materia")
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("eliminar")
        .setDescription("Eliminar una materia de la lista")
        .addStringOption((option) =>
          option
            .setName("materia")
            .setDescription("Nombre de la materia")
            .setAutocomplete(true)
            .setRequired(true)
        )
    ),
  async autocomplete(interaction) {
    const value = interaction.options.getFocused().toLowerCase();
    let choices = materiasData;
    const filtered = choices
      .filter((materia) => materia.name.toLowerCase().includes(value))
      .slice(0, 25);
    if (!interaction) return;

    await interaction.respond(
      filtered.map((choice) => ({
        name: choice.name,
        value: choice.id.toString(),
      }))
    );
  },
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "agregar") {
      await agregarMateria(interaction, client);
    } else if (subcommand === "eliminar") {
      await eliminarMateria(interaction, client);
    } else if (subcommand === "mostrar") {
      const server = guilds.find((x) => x.serverid == interaction.guildId);
      if (server) {
        const materias = server.materias.map((x) => x.name);
        await interaction.editReply(
          `Lista de materias: ${materias.join(", ")}`
        );
      }
    }
  },
};
