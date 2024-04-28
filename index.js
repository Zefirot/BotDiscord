const Discord = require("discord.js");
require("dotenv").config();
require("colors");

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
        Discord.IntentsBitField.Flags.MessageContent,
        Discord.IntentsBitField.Flags.GuildVoiceStates
    ]
})

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

function requiredHandlers() {
    ["command","events","distube"].forEach(handler => {
        try {
            require('./src/handlers/'+ handler)(client, Discord)
        } catch (error) {
            console.warn(error);
        }
    })
    
}

requiredHandlers();

client.login(process.env.TOKEN);
    
