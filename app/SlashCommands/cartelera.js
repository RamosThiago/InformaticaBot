import pkg from "discord.js";
import { fetchAdvertises, materiasData } from "../Fetch/fetchCartelera.js";

const cheerio = await import("cheerio");

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} = pkg;

async function chargeAdvertises(interaction, pages, time = 60000) {
  try {
    var index = 0;

    const firstButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("⏪")
      .setCustomId("first")
      .setDisabled(true);

    const lastButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("⏩")
      .setCustomId("last")
      .setDisabled(pages.length === 1);

    const backButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("⬅️")
      .setCustomId("back")
      .setDisabled(pages.length === 1);

    const forwardButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("➡️")
      .setCustomId("forward")
      .setDisabled(pages.length === 1);

    const pageCountButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setLabel(`${index + 1}/${pages.length}`)
      .setCustomId("pageCount")
      .setDisabled(true);

    const Buttons = new ActionRowBuilder().addComponents([
      firstButton,
      backButton,
      pageCountButton,
      forwardButton,
      lastButton,
    ]);

    console.log(pages[index]);

    const msg = await interaction.editReply({
      embeds: [pages[index]],
      components: [Buttons],
      fetchReply: true,
    });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        return await i.reply({
          content: `Que haces wachin. Solo ${interaction.user.username} puede interactuar con los botones.`,
          ephemeral: true,
        });
      }

      if (i.customId === "first") {
        index = 0;
        pageCountButton.setLabel(`${index + 1}/${pages.length}`);
      }

      if (i.customId === "last") {
        index = pages.length - 1;
        pageCountButton.setLabel(`${index + 1}/${pages.length}`);
      }

      if (i.customId === "back") {
        index = index > 0 ? index - 1 : pages.length - 1;
        pageCountButton.setLabel(`${index + 1}/${pages.length}`);
      } else if (i.customId === "forward") {
        index = index + 1 < pages.length ? index + 1 : 0;
        pageCountButton.setLabel(`${index + 1}/${pages.length}`);
      }

      if (index === 0) {
        firstButton.setDisabled(true);
      } else {
        firstButton.setDisabled(false);
      }

      if (index === pages.length - 1) {
        lastButton.setDisabled(true);
      } else {
        lastButton.setDisabled(false);
      }

      await i
        .update({ embeds: [pages[index]], components: [Buttons] })
        .catch((error) =>
          console.log("Error en la función displayAdvertises: " + error)
        );

      collector.resetTimer();
    });

    collector.on("end", async () => {
      await msg
        .edit({ embeds: [pages[index]], components: [] })
        .catch((error) =>
          console.log("Error en la función displayAdvertises: " + error)
        );
    });

    return msg;
  } catch (error) {
    console.log("Error en la función displayAdvertises: " + error);
    throw error;
  }
}

export async function displayAdvertises(interaction) {
  const id = interaction.options.getString("materia") || "";
  const info = await fetchAdvertises(id);
  const embeds = [];

  for (let i = 0; i < info.count; i++) {
    const cuerpoTexto = cheerio.load(info.mensajes[i].cuerpo).text();
    let adjuntosTexto = "";

    console.log(info.mensajes[i].adjuntos);

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
  await chargeAdvertises(interaction, embeds);
}
