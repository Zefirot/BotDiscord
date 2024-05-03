module.exports = client => {
    console.log("Sesion iniciada como: " + client.user.tag);

    if(client?.application?.commands){
        client.application.commands.set(client.slashArray);
        console.log("Comandos Publicados!!".green);
    }
}