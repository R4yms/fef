const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "resume",
    description: "To Resume The Paused Music",
    usage: "resume",
    aliases: [],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
      .setColor("#323131")
      .setAuthor("Music Has Been Resumed!")
      return message.channel.send(xd);
    }
    return sendError("There Is Nothing Playing In This Server.", message.channel);
  },
};
