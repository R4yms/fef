const discord = require('discord.js');
module.exports = {
    info: {
        name: "ping",
        description: "To See The Bot Latency.",
        usage: "[ping]",
        aliases: ["pg"],
    },

    run: async function (client, message, args) {
        let embed = new discord.MessageEmbed()
        .setDescription(`My Ping: ${client.ws.ping}ms`)
        .setColor("#323131")

        message.channel.send(embed)
    },
}