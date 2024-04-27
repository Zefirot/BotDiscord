const { default: SoundCloudPlugin } = require("@distube/soundcloud");
const { default: SpotifyPlugin } = require("@distube/spotify");
const {DisTube} = require("distube");

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
}