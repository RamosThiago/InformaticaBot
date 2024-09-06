const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");

async function displayPostsEmbed(interaction, pages, time = 60000) {
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

module.exports = displayPostsEmbed;
