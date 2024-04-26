const Discord = require("discord.js");
const config = require("./config/config.json");
require("dotenv").config();

const client = new Discord.Client({
    allowedMentions:{
        parse: ["users", "roles"],
        repliedUser:true,
    },
    partials:["MESSAGE", "CHANNEL","REACTION"],
    intents:[
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.GuildMembers,
        Discord.IntentsBitField.Flags.GuildMessages,
        Discord.IntentsBitField.Flags.DirectMessages,
        Discord.IntentsBitField.Flags.DirectMessageReactions,
        Discord.IntentsBitField.Flags.MessageContent
    ]
})

console.log("🚀 ~ process.env.TOKEN:", process.env.TOKEN)
client.login(process.env.TOKEN);


client.on("ready", () => {
    console.log("Bot Encendido bajo el usuario: " + client.user.tag);
})

//Commands
client.on("messageCreate", async (message) => {    
    if(!message.guild || message.author.bot) {return};

    const args = message.content.slice(config.prefix.length).trim().split(" ");
    const cmd = args.shift()?.toLowerCase();

    if(!message.content.startsWith(config.prefix) || !cmd || cmd.length==0) return;

    if(cmd == "ping"){
        return message.reply("El ping del bot es: " + client.ws.ping);
    }
})
    
