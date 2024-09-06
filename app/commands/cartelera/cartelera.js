const { SlashCommandBuilder } = require("discord.js");
const displayPosts = require("./displayCartelera.js");
const materiasData = require("./materias.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cartelera")
    .setDescription("Muestra la cartelera general o de una materia")
    .addStringOption((option) =>
      option
        .setName("materia")
        .setAutocomplete(true)
        .setDescription("Materia a buscar")
    ),
  async autocomplete(interaction) {
    const value = interaction.options.getFocused().toLowerCase();
    const filtered = materiasData
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
    await displayPosts(interaction);
  },
};
