const discord = require('discord.js');
module.exports = {
    info: {
        name: "stats",
        description: "To see the bot stats",
        usage: "[stats]",
        aliases: ["stats"],
    },

    run: async function (client, message, args) {
        let embed = new discord.MessageEmbed()
        .setColor("#323131")
        .setThumbnail(client.user.displayAvatarURL())
        .setAuthor(`STATS AND INFORMATION`, client.user.displayAvatarURL())
        .setDescription(`My name is **${client.user.username}** and My work is to play Music`)
        .addField("SERVERS", client.guilds.cache.size, true)
        .addField("ID", client.user.id, true)
        .addField("PRESENCE", client.user.presence.activities[0].name, true)
        .addField("UPTIME", client.uptime, true)
        .addField("STATUS", client.user.presence.status, true)
        .addField("TOTAL MEMBERS", client.users.cache.size)

        message.channel.send(embed)
    },
}