const { SlashCommandBuilder } = require("discord.js");
const { materiasData } = require("../cartelera/fetchCartelera.js");
const { readFile, writeFile } = require("node:fs").promises;

async function agregarMateria(interaction) {
  const materiaid = interaction.options.getString("materia");
  const nombre = materiasData.find((m) => m.id == materiaid)
    ? materiasData.find((m) => m.id == materiaid).name
    : null;

  if (nombre) {
    const guildid = interaction.guildId;

    try {
      const guilds = await readFile("./app/guilds.json", "utf8");
      const jsonObject = JSON.parse(guilds);

      const server = jsonObject.find((x) => x.serverid === guildid);

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
        jsonObject.push({
          serverid: guildid,
          canal: [],
          materias: [{ id: materiaid, name: nombre }],
        });
      }

      const changedJson = JSON.stringify(jsonObject, null, 2);
      await writeFile("./app/guilds.json", changedJson, "utf8");
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

async function eliminarMateria(interaction) {
  const materiaid = interaction.options.getString("materia");
  const nombre = materiasData.find((m) => m.id == materiaid)
    ? materiasData.find((m) => m.id == materiaid).name
    : null;

  if (nombre) {
    const guildid = interaction.guildId;

    try {
      const guilds = await readFile("./app/guilds.json", "utf8");
      const jsonObject = JSON.parse(guilds);

      const server = jsonObject.find((x) => x.serverid === guildid);

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

      const changedJson = JSON.stringify(jsonObject, null, 2);
      await writeFile("./app/guilds.json", changedJson, "utf8");
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
  async execute(interaction) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "agregar") {
      await agregarMateria(interaction);
    } else if (subcommand === "eliminar") {
      await eliminarMateria(interaction);
    } else if (subcommand === "mostrar") {
      await interaction.editReply("Lista de materias: 8====D");
    }
  },
};
