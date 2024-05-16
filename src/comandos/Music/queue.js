const {displayQueueEmbed} = require("../../helpers/displayQueueEmbed");

module.exports = {
    name: "queue",
    aliases: ["q","cola"],
    desc: "Sirve para ver la lista de canciones",
    run: async (client, message, args, prefix) => {
        //Comprobaciones 
        if(!message.member.voice?.channel) return message.reply("❌ **Es necesario que estes en un canal para usar este comando**");

        const queue = client.distube.getQueue(message);

        if(!queue) return message.reply("❌ **No hay ninguna cancion para mostrar la cola**")

        displayQueueEmbed(client, message, queue);     
    }
}