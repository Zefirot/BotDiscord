const { default: SoundCloudPlugin } = require("@distube/soundcloud");
const { default: SpotifyPlugin } = require("@distube/spotify");
const { DisTube } = require("distube");
const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
    client.distube = new DisTube(client, {
        emitNewSongOnly: false,
        leaveOnEmpty: true,
        leaveOnFinish: true,
        leaveOnStop: true,
        savePreviousSongs: true,
        emitAddListWhenCreatingQueue: false,
        searchSongs: 0,
        nsfw: false,
        emptyCooldown: 25,
        ytdlOptions:{
            highWaterMark: 1024 * 1024 * 64,
            quality: "highestaudio",
            format: "audioonly",
            liveBuffer: 60000,
            dlChunkSize: 1024 * 1024 * 4,
        },
        plugins: [
            new SpotifyPlugin({
                parallel: true,
                emitEventsAfterFetching: true,
            }),
            new SoundCloudPlugin()
        ]
    })

    //Eventos Distube
    client.distube.on("playSong", (queue, song) => {
        queue.textChannel.send({
            embeds: [getActualSongEmbed("Reproduciendo", song)]
        })
    });

    client.distube.on("addSong", (queue, song) => {
        if(queue.songs.length == 1) return
        queue.textChannel.send({
            embeds: [getActualSongEmbed("Añadiendo", song)]
        })
    });

    client.distube.on("initQueue", (queue) => {
        queue.autoplay = true
    });
}

const getActualSongEmbed = (text, song) => {
    return new EmbedBuilder()
    .setTitle(`✅ ${text} \`${song.name}\` . \`${song.formattedDuration}\``)
    .setThumbnail(song.thumbnail)
    .setURL(song.url)
    .setColor("#8400ff")
    .setFooter({text: `Añadida por ${song.user.tag}`, iconURL: song.user.displayAvatarURL({dynamic:true})})
}