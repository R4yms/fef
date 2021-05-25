const { MessageEmbed } = require('discord.js')



    run: async function(client, message, args){
module.exports = {
    info: {
        name: "help",
        description: "To Show Help Menu",
        usage: "[command]",
        aliases: ["help", "helppls", "helpme"]
    },
        client.commands.forEach(cmd => {
             var allcmds = "";
            let cmdinfo = cmd.info
            allcmds+="`"+client.config.prefix+cmdinfo.name+" "+cmdinfo.usage+"` ~ "+cmdinfo.description+"\n"
        })

        let embed = new MessageEmbed()
        .setAuthor("Lrs Music Help Menu")
        .setColor("#323131")
        .setDescription('')
        .addField('Music', '`.play`, `.stop`, `.pause`, `.resume`, `.loop`, `.queue`, `.remove`, `.np`, `.skip`, `.lyrics`, `.volume`, `.search`, `.join`, `.leave`', true)
        .setFooter(`Lrs Music Commands`)
        .setThumbnail("https://cdn.discordapp.com/icons/828222553053986836/3434677e47dd167c56e3203156a4b888.png?size=128")

        if(!args[0])return message.channel.send(embed)
        else {
            let cmd = args[0]
            let command = client.commands.get(cmd)
            if(!command)command = client.commands.find(x => x.info.aliases.includes(cmd))
            if(!command)return message.channel.send("Unknown Command")
            let commandinfo = new MessageEmbed()
            .setTitle("Command: "+command.info.name+" Info")
            .setColor("#323131")
            .setDescription(`
Name: ${command.info.name}
Description: ${command.info.description}
Usage: \`\`${client.config.prefix}${command.info.name} ${command.info.usage}\`\`
Aliases: ${command.info.aliases.join(", ")}
`)
            message.channel.send(commandinfo)
        }
    }
} 