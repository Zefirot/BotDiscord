const config = require(process.cwd()+"/config/config.json")

module.exports = async (client, interaction) => {
    if(!interaction.guild || !interaction.channel) return;

    const command = client.slashCommands.get(interaction?.commandName)
    
    if(command){
        command.run(client, interaction, config.prefix);
    }else{
        return message.reply("No se encontro ningun comando relacionado");
    }
}