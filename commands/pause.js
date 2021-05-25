const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "pause",
    description: "To Pause The Current Music In The Server",
    usage: "[pause]",
    aliases: ["pause"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
	    try{
      serverQueue.connection.dispatcher.pause()
	  } catch (error) {
        message.client.queue.delete(message.guild.id);
        return sendError(`The Player Has Stopped And The Queue Has Been Cleared.: ${error}`, message.channel);
      }	    
      let xd = new MessageEmbed()
      .setDescription("⏸ Paused The Music For You!")
      .setColor("#323131")
      .setTitle("Music Has Been Paused!")
      return message.channel.send(xd);
    }
    return sendError("There Is Nothing Playing In This Server.", message.channel);
  },
};
