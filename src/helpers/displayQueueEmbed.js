const Discord = require("discord.js");
let paginaActual;

const displayQueueEmbed = (client, message, queue) => {
    const listQueue = [];
    const maxSongsPerPage = 10;
    paginaActual = 0;

    for (let i = 0; i < queue.songs.length; i += maxSongsPerPage) {
        const songs = queue.songs.slice(i, i + maxSongsPerPage);
        listQueue.push(songs.map((song, index) => `**\`${i + ++index}\`** - [\`${song.name}\`](${song.url})`).join("\n "))
    }

    const embeds = [];

    listQueue.forEach( song => {
        const description = String(song.substring(0, 2048)); //Se asegura que la longitud del mensaje sea menor a 2048

        const embed = new Discord.EmbedBuilder()
            .setTitle(`🎵 Cola de ${message.guild.name} - \`[${queue.songs.length} ${queue.songs.length > 1 ? "Canciones" : "Cancion"}]\``)
            .setColor("#8400ff")
            .setDescription(description);

        if (queue.songs.length >= 1) embed.addFields({ name: `💿 Cancion Actual`, value: `**[\`${queue.songs[0].name}\`](${queue.songs[0].url})**` });
        
        embeds.push(embed);
    });

    paginacion(client, message, embeds); 
}

const paginacion = async (client, message, embeds) => {
    if(embeds.length === 1 ) return message.reply({embeds: [embeds[0]]});

    const buttonArray = createButtons();
    const actionRow = new Discord.ActionRowBuilder().addComponents(buttonArray);

    const embedPaginas = await message.reply({
        content: `**Haz click en los __Botones__ para cambiar de pagina**`,
        embeds: [embeds[0].setFooter({text: `Pagina ${paginaActual+1} / ${embeds.length}`})],
        components: [actionRow],
        fetchReply: true
    });

    const collector = await embedPaginas.createMessageComponentCollector({
        componentType: Discord.ComponentType.Button,
        time: 8_000
    })

    //Se remueve el listener anterior
    client.removeAllListeners("clickButton", () => {});

    client.on("clickButton", async interaction => {
        if(!interaction.isButton()) return;

        const buttonCustomId = interaction?.customId;

        collector.resetTimer();

        if(buttonCustomId == "Atras"){
            //Si no estoy en la pagina actual se va para atras, si estoy entonces voy al final
            paginaActual = paginaActual !==0 ? paginaActual-1 : embeds.length-1;
        }
        else if(buttonCustomId == "Inicio"){
            paginaActual = 0;
        }
        else if(buttonCustomId == "Avanzar"){
            //Si estoy antes del final voy para adelante, si estoy en el final me voy para el principio
            paginaActual = paginaActual < embeds.length-1 ? paginaActual+1 : 0
        }

        await interaction.update({
            embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })],
            components: [actionRow]
        });
    });
        
    collector.on("end", async () => {
        buttonArray.forEach(button => button.setDisabled(true));

        await embedPaginas.edit({
            content: "El tiempo ha expirado, vuelva a consultar la cola",
            embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })],
            components: [actionRow]
        });
    })
}

const createButtons = () => {
    const boton_atras = new Discord.ButtonBuilder()
    .setStyle(Discord.ButtonStyle.Success)
    .setCustomId("Atras")
    .setEmoji("◀️")
    .setLabel("Atras");

    const boton_inicio = new Discord.ButtonBuilder()
    .setStyle(Discord.ButtonStyle.Danger)
    .setCustomId("Inicio")
    .setEmoji("🏠")
    .setLabel("Inicio");

    const boton_avanzar = new Discord.ButtonBuilder()
    .setStyle(Discord.ButtonStyle.Success)
    .setCustomId("Avanzar")
    .setEmoji("▶️")
    .setLabel("Avanzar");

    return [boton_atras, boton_inicio, boton_avanzar];
}

module.exports = {displayQueueEmbed}