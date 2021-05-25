const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "volume",
    description: "To Change The Server Song Queue Bolume",
    usage: "[volume]",
    aliases: ["v", "vol"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("I'm Sorry But You Need To Be In A Voice Channel To Play Music!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("There Is Nothing Playing In This Server.", message.channel);
    if (!serverQueue.connection) return sendError("There Is Nothing Playing In This Server.", message.channel);
    if (!args[0])return message.channel.send(`The Current Volume Is: **${serverQueue.volume}**`);
     if(isNaN(args[0])) return message.channel.send('Numbers Only!').catch(err => console.log(err));
    if(parseInt(args[0]) > 150 ||(args[0]) < 0) return sendError('You Can\'t Set The Volume More Than 150. Or Lower Than 0',message.channel).catch(err => console.log(err));
    serverQueue.volume = args[0]; 
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    let xd = new MessageEmbed()
    .setDescription(`Music Volume Adjusted To: **${args[0]/1}/150**`)
    .setAuthor("Server Volume Manager")
    .setColor("#323131")
    .setTimestamp();
    return message.channel.send(xd);
  },
};