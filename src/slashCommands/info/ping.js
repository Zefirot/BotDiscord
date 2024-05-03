const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para ver la latencia del bot"),

    run: async (client, interaction, prefix) => {
        return interaction.reply("El ping del bot es de: "+client.ws.ping);
    }
}