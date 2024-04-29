const fs = require("fs");
const path = require("path");
const allevents = [];

module.exports = async (client) => {
    try {        
        console.log("Cargando los eventos...".bgRed);    

        let cantidad = 0;

        const cargar_dir = dir => {
            const ruta = path.join(__dirname.replace("handlers","eventos"), dir)
            const archivos_eventos = fs.readdirSync(ruta).filter( file => file.endsWith(".js") );
            
            for(const archivo of archivos_eventos){
                try {
                    const evento = require("../eventos/"+dir+"/"+archivo);
                    const nombre_evento = archivo.split(".")[0];
                    allevents.push(nombre_evento);
                    client.on(nombre_evento, evento.bind(null, client));
                    cantidad++;
                } catch (error) {
                    console.log("🚀 ~ module.exports= ~ error:", error);
                }
            }
        }

        await ["client","guild"].forEach(e => cargar_dir(e));
        console.log(`${cantidad} Eventos cargados`.bgGreen);
        try{console.log("Iniciando Sesion del bot...")} catch(e) {console.log(e)}
    } catch (error) {
        console.log("🚀 ~ events.js= ~ error:", error)   
    }
}