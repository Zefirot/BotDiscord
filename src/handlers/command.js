//onst { captureRejectionSymbol } = require("events");
const { log } = require("console");
const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    try {
        console.log("Cargando Comandos");
        let comandos = 0;

        const ruta = __dirname.replace("handlers","comandos");

        fs.readdirSync(ruta).forEach( carpeta => {
            const rutaArchivo = path.join(ruta,carpeta);

            const commands = fs.readdirSync(rutaArchivo).filter(archivo => archivo.endsWith(".js"));

            for(let archivo of commands){
                let comando = require("../comandos/"+carpeta+"/"+archivo);

                if(comando.name){
                    client.commands.set(comando.name, comando);
                    comandos++;
                }else{
                    console.log("Comando "+carpeta+" "+ archivo+ "error el comando no esta configurado");
                    continue;
                }
                if(comando.aliases && Array.isArray(comando.aliases)){
                    comando.aliases.forEach( alias =>{
                        client.aliases.set(alias, comando.name);
                    } )
                }
            }       
        } )

        console.log("Comandos Cargados: "+comandos);

    } catch (error) {
        console.log("🚀 ~ error:", error)
    }
}