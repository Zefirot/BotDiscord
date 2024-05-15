const config = require(process.cwd()+"/config/config.json")

module.exports = async (client, interaction) => {
    if(!interaction.guild || !interaction.channel) return;

    const command = client.slashCommands.get(interaction?.commandName)
    
    if (interaction.type == 3) { //Para los casos de interaccion mediante botones
        client.emit("clickButton", interaction)
    }
    else if(command){
        command.run(client, interaction, config.prefix);
    }else{
        return interaction.reply("No se encontro ningun comando relacionado");
    }
}