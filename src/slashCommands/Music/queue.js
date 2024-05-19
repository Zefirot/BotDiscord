const {SlashCommandBuilder} = require("discord.js");
const {displayQueueEmbed} = require("../../helpers/displayQueueEmbed");

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para ver la cola de musica"),

    run: async (client, interaction, prefix) => {
        const queue = client.distube.getQueue(interaction);
        displayQueueEmbed(client, interaction, queue);
    }
}