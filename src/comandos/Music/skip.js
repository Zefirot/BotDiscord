module.exports = {
    name: "skip",
    aliases: ["s","saltar"],
    desc: "Sirve para saltar una cancion",
    run: async (client, message, args, prefix) => {
        //Comprobaciones
        const queue = client.distube.getQueue(message);
        if(!queue) return message.reply("❌ **No hay ninguna cancion para saltar**")
    
        if(!message.member.voice?.channel) return message.reply("❌ **Es necesario que estes en un canal para usar este comando**");

        if(args.length){
            const jumpTo = Number(args.join(" "));
            queue.jump(jumpTo-1);
            message.reply(`⏭️ ** Saltando a la cancion en posicion ${jumpTo}**`);
        }else{
            client.distube.skip(message);
            message.reply(`⏭️ ** Saltando a la siguiente cancion **`);
        }
    }
}