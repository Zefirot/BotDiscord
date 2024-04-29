module.exports = {
    name: "play",
    aliases: ["reproducir"],
    desc: "Sirve para reproducir una cancion",
    run: async (client, message, args, prefix) => {
        //Comprobaciones   
        if(!args.length) return message.reply("❌ **Se debe especificar un nombre de cancion**");
        if(!message.member.voice?.channel) return message.reply("❌ **Es necesario que estes en un canal para usar este comando**");

        client.distube.play(message.member.voice?.channel, args.join(" "), {
            member: message.member,
            textChannel: message.channel,
            message
        });

        message.reply("Buscando la cancion");
    }
}