const { EmbedBuilder } = require("discord.js");
const cheerio = require("cheerio");

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

module.exports = makeEmbed;
