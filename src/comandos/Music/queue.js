const Discord = require("discord.js");
module.exports = {
    name: "queue",
    aliases: ["q","cola"],
    desc: "Sirve para ver la lista de canciones",
    run: async (client, message, args, prefix) => {
        //Comprobaciones 
        if(!message.member.voice?.channel) return message.reply("❌ **Es necesario que estes en un canal para usar este comando**");

        const queue = client.distube.getQueue(message);

        const listQueue = [];
        const maxSongsPerPage = 10;

        for(let i=0; i < queue.songs.length; i+=maxSongsPerPage){
            const songs = queue.songs.slice(i,i + maxSongsPerPage);
            listQueue.push(songs.map((song, index) => `**\`${i+ ++index}\`** - [\`${song.name}\`](${song.url})`).join("\n "))
        }

        const embeds = [];

        for(let i=0; i < listQueue.length; i++){
            const description = String(listQueue[i].substring(0,2048)); //Se asegura que la longitud del mensaje sea menor a 2048

            const embed = new Discord.EmbedBuilder()
            .setTitle(`🎵 Cola de ${message.guild.name} - \`[${queue.songs.length} ${queue.songs.length > 1 ? "Canciones" : "Cancion"}]\``)
            .setColor("#8400ff")
            .setDescription(description);

            if(queue.songs.length > 1) embed.addFields({name:`💿 Cancion Actual`, value: `**[\`${queue.songs[0].name}\`](${queue.songs[0].url})**`});

            embeds.push(embed);
        }

        return paginacion();

        async function paginacion(){
            let paginaActual = 0;

            if(embeds.length === 1 ) return message.channel.send({embeds: [embeds[0]]}).catch(()=>{});

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

            const embedPaginas = await message.channel.send({
                content: `**Haz click en los __Botones__ para cambiar de pagina`,
                embeds: [embeds[0].setFooter({text: `Pagina ${paginaActual+1} / ${embeds.length}`})],
                components: [new Discord.ActionRowBuilder().addComponents([boton_atras, boton_inicio, boton_avanzar])]
            });

            const collector = embedPaginas.createMessageComponentCollector({
                filter: i => i?.isButton(),
                time: 15_000
            })

            client.on("clickButton", async button => {
                const buttonCustomId = button?.customId;

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

                await embedPaginas.edit({
                    embeds: [embeds[paginaActual].setFooter({text: `Pagina ${paginaActual+1} / ${embeds.length}`})],
                    components: [embedPaginas.components[0]]}).catch(()=>{});

                await button?.deferUpdate();
            })

            collector.on("end", async () => {
                embedPaginas.components[0].components.map(boton => boton.setDisabled(true));

                await embedPaginas.edit({
                    content: "El tiempo ha expirado, vuelva a consultar la cola",
                    embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })],
                    components: [embedPaginas.components[0]]
                }).catch(() => { });
            })

        }
    }
}