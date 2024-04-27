const { captureRejectionSymbol } = require("events");
const fs = require("fs");

module.exports = (client) => {
    try {
        let comandos = 0;

        fs.readdirSync("./comandos/").forEach( carpeta => {
            const commands = fs.readdirSync("./comandos/" + carpeta).filter(archivo => archivo.endsWith(".js"));

            for(let archivo of commands){
                let comando = require("../comandos"+carpeta+"/"+archivo);

                if(comando.name){
                    client.commands.set(comando.name, comando);
                    comandos++;
                }else{
                    console.log("Comando "+carpeta+" "+ archivo+ "error el comando no esta configurado");
                    continue;
                }
                if(commands.aliases && Array.isArray(comando.aliases)){
                    comando.aliases.forEach( alias =>{
                        client.aliases.set(alias, comando.name);
                    } )
                }
            }       
        } )
    } catch (error) {
        
    }
}