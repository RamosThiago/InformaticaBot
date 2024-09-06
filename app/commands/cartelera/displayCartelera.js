const { EmbedBuilder } = require("discord.js");
const cheerio = require("cheerio");
const fetchPosts = require("./fetchCartelera.js");
const displayPostsEmbed = require("./embedCartelera.js");
const materiasData = require("./materias.json");

async function displayPosts(interaction) {
  const id = interaction.options.getString("materia") || "";
  const info = await fetchPosts(id);
  const embeds = [];

  for (let i = 0; i < info.count; i++) {
    const cuerpoTexto = cheerio.load(info.mensajes[i].cuerpo).text();
    let adjuntosTexto = "";

    if (info.mensajes[i].adjuntos && info.mensajes[i].adjuntos.length > 0) {
      adjuntosTexto = info.mensajes[i].adjuntos
        .map((adj) => `[${adj.nombre}](${adj.public_path})`)
        .join("\n");
    }
    embeds.push(
      new EmbedBuilder()
        .setAuthor({
          name: `${info.mensajes[i].materia}`,
          iconURL: "https://gestiondocente.info.unlp.edu.ar/favicon.png",
          url: `https://gestiondocente.info.unlp.edu.ar/cartelera/#form[materia]=&${id}`,
        })
        .setTitle(
          `${
            info.mensajes[i].is_anulado
              ? `~~${info.mensajes[i].titulo}~~`
              : `${info.mensajes[i].titulo}`
          }`
        )
        .setDescription(
          `${
            info.mensajes[i].is_anulado
              ? `~~${cuerpoTexto} \n\n ${adjuntosTexto}~~`
              : `${cuerpoTexto} \n\n ${adjuntosTexto}`
          }`
        )
        .setColor("#a30a16")
        .setFooter({
          text: `${
            info.mensajes[i].is_anulado
              ? ` ${`Publicado por ${info.mensajes[i].autor.trim()} el ${
                  info.mensajes[i].fecha
                } y anulado el ${new Date(
                  info.mensajes[i].fecha_anulacion
                ).toLocaleDateString()}`}`
              : `${`Publicado por ${info.mensajes[i].autor.trim()} el ${
                  info.mensajes[i].fecha
                }`}`
          }`,
        })
    );
  }

  if (embeds.length === 0) {
    let nombreMateria = "Materia no encontrada";

    for (const categoria in materiasData) {
      console.log(materiasData[categoria]);
      const materiaSeleccionada = materiasData[categoria].find(
        (materia) => materia.id.toString() === id
      );
      console.log(materiaSeleccionada);
      if (materiaSeleccionada) {
        nombreMateria = materiaSeleccionada.name;
        break;
      }
    }
    embeds.push(
      new EmbedBuilder()
        .setAuthor({
          name: `${nombreMateria}`,
          iconURL: "https://gestiondocente.info.unlp.edu.ar/favicon.png",
          url: `https://gestiondocente.info.unlp.edu.ar/cartelera/#form[materia]=&${id}`,
        })
        .setDescription(
          "No hay mensajes en la cartelera de la materia seleccionada"
        )
        .setColor("#a30a16")
    );
  }
  await displayPostsEmbed(interaction, embeds);
}

module.exports = displayPosts;
