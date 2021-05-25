const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    info: {
        name: "join",
        aliases: ["come", "connect", "hey"],
        description: "Join The Voice Channel!",
        usage: "Join",
    },

    run: async function (client, message, args) {
        let channel = message.member.voice.channel;
        if (!channel) return sendError("I'm Sorry But You Need To Be In A Voice Channel!", message.channel);
        if (!permissions.has("CONNECT")) return sendError("I Cannot Connect To Your Voice Channel, Make Sure I Have The Proper Permissions!", message.channel);

        try {
            const connection = await channel.join();
            queueConstruct.connection = connection;
            play(queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I Could Not Join The Voice Channel: ${error}`);
        }

        const Embed = new MessageEmbed()
            .setAuthor("Joined Voice Channel")
            .setColor("#323131")  
            .setTimestamp();

        return message.channel.send(Embed).catch(() => message.channel.send(" Joined The Voice Channel :)"));
    },
};