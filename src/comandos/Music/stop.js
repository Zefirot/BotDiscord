module.exports = {
    name: "stop",
    aliases: ["desconectar","leave"],
    desc: "Sirve para desconectar el bot",
    run: async (client, message, args, prefix) => {
        //Comprobaciones
        const queue = client.distube.getQueue(message);
        if(!queue) return message.reply("❌ **No hay ninguna cancion para saltar**")
    
        if(!message.member.voice?.channel) return message.reply("❌ **Es necesario que estes en un canal para usar este comando**");

        client.distube.stop(message);

        message.reply("** Apagando Luces 🐲 **");
    }
}