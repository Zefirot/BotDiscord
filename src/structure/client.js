const {Client, GatewayIntentBits, Partials, ActivityType, PresenceUpdateStatus, Collection} = require("discord.js");
const BotUtils = require("./util");

module.exports = class extends Client{
    constructor(){ 
        const options = {
            intents:[
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
            ],
            Partials:[Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction],

            allowedMentions:{
                parse: ["users", "roles"],
                repliedUser:true,
            },

            presence: {
                activities: [{name: process.env.STATUS, type: ActivityType[process.env.STATUS_TYPE]}],
                status : PresenceUpdateStatus.Online 
            }
        };

        super({...options});

        this.commands = new Collection();
        this.slashCommands = new Collection();
        this.slashArray = [];

        this.util = new BotUtils(this);

        this.start();
    }

    async start(){
        
        await this.loadEvents();
        await this.loadHandlers();
        await this.loadCommands();
        await this.loadSlashCommands();
        
        this.login(process.env.TOKEN);
    }

    async loadCommands(){
        console.log("(+) Cargando Comandos".red);
        await this.commands.clear();

        const rutasArchivos = await this.util.loadFile("/src/comandos");

        if(rutasArchivos.length){
            rutasArchivos.forEach(rutaArchivo => {
                
                try {
                    const comando = require(rutaArchivo);
                    const nombreComando = rutaArchivo.split("\\").pop().split("/").pop().split(".")[0];
                    comando.name = nombreComando;

                    if(nombreComando){
                        this.commands.set(nombreComando, comando);
                    }

                } catch (error) {
                    console.log(`Error al cargar archivo`.red);
                    console.log(error);
                }

            });
        }

        console.log(`${this.commands.size} Comandos Cargados`.green);
    }

    async loadSlashCommands(){
        console.log("(+) Cargando Slash Commands".red);
        await this.slashCommands.clear();
        this.slashArray = [];

        const rutasArchivos = await this.util.loadFile("/src/slashCommands");

        if(rutasArchivos.length){
            rutasArchivos.forEach(rutaArchivo => {
                
                try {
                    const comando = require(rutaArchivo);
                    
                    const nombreComando = rutaArchivo.split("\\").pop().split("/").pop().split(".")[0];
                    comando.CMD.name = nombreComando;

                    
                    if(nombreComando){
                        this.slashCommands.set(nombreComando, comando);
                        this.slashArray.push(comando.CMD.toJSON());
                    }

                } catch (error) {
                    console.log(`Error al cargar archivo`.red);
                    console.log(error);
                }

            });
        }

        console.log(`${this.slashCommands.size} Slash Commands Cargados`.green);

        if(this?.application?.commands){
            this.application.commands.set(this.slashArray);
            console.log("Comandos Publicados!!".green);
        }
    }

    async loadHandlers(){
        console.log("(+)Cargando Handlers".red);
        this.commands.clear();

        const rutasArchivos = await this.util.loadFile("/src/handlers");
        
        if(rutasArchivos.length){
            
            rutasArchivos.forEach(rutaArchivo => {
                
                try {
                    require(rutaArchivo)(this);
                } catch (error) {
                    console.log(`Error al cargar archivo`.red);
                    console.log(error);
                }

            });
        }

        console.log(`(-) Handlers Cargados`.green);
    }

    async loadEvents(){
        console.log("(+) Cargando Eventos".red);
        this.removeAllListeners();

        const rutasArchivos = await this.util.loadFile("src/eventos");

        if(rutasArchivos.length){
            rutasArchivos.forEach(rutaArchivo => {
                
                try {
                    const evento = require(rutaArchivo);
                    const nombreEvento = rutaArchivo.split("\\").pop().split("/").pop().split(".")[0];
                    
                    this.on(nombreEvento, evento.bind(null, this));
                } catch (error) {
                    console.log(`Error al cargar archivo`.red);
                    console.log(error);
                }

            });
        }

        console.log(`(-) Eventos Cargados`.green);
    }
}