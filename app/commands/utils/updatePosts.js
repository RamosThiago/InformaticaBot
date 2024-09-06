const fs = require("fs");
const { setTimeout } = require("timers/promises");
const fetchPosts = require("../utils/fetchPosts.js");
const stringToDate = require("./stringToDate.js");
const makeEmbed = require("./makeEmbed.js");
const client = require("../../index.js");

/*
 * Se fija segun cada servidor las materias que tiene configuradas para verificar si hay mensajes
 * nuevos y enviarlos al canal, y actualiza la fecha del ultimo mensaje enviado de esa materia.
 */

const updatePosts = async () => {
  for (let serverInfo of client.servers) {
    const { serverid, canal: canalId, materias } = serverInfo;

    if (!canalId || materias.length === 0) continue;

    try {
      const server = await client.guilds.fetch(serverid);
      const canal = await server.channels.fetch(canalId);

      // Va a cargar los ultimos 5 mensajes de cada materia y enviar todos los posteriores a la ultima fecha guardada
      for (let materia of materias) {
        const lastPosts = await fetchPosts(materia.id, 5);

        if (
          !lastPosts ||
          !lastPosts.mensajes ||
          lastPosts.mensajes.length === 0
        )
          continue;

        const lastPostDate = stringToDate(lastPosts.mensajes[0].fecha);
        const previousPostDate = stringToDate(client.lastDates[materia.id]);

        const isLast =
          previousPostDate &&
          lastPostDate &&
          (previousPostDate.getTime() === lastPostDate.getTime() ||
            previousPostDate.getTime() > lastPostDate.getTime());

        if (isLast) continue;

        // Se actualiza la ultima fecha en el json y en el cliente
        client.lastDates[materia.id] = lastPosts.mensajes[0].fecha;

        fs.writeFileSync(
          "./app/lastMessage.json",
          JSON.stringify(client.lastDates, null, "\t")
        );

        // Obtengo los posts que esten despues de la anterior fecha que estaba guardada
        const newPosts = [];
        for (let post of lastPosts.mensajes) {
          const actualPostDate = stringToDate(post.fecha);
          if (
            !previousPostDate ||
            !actualPostDate ||
            actualPostDate.getTime() > previousPostDate.getTime()
          ) {
            newPosts.push(post);
          }
        }

        // Envio los mensajes desde los mas viejos a los mas nuevos
        for (let i = newPosts.length - 1; i >= 0; i--) {
          await canal.send({
            embeds: [makeEmbed(newPosts[i], materia.id)],
          });
        }

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

module.exports = updatePosts;
