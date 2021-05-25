const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "nowplaying",
    description: "To Show The Music Whith Is Currently Playing In This Server.",
    usage: "",
    aliases: ["np"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("There Is Nothing Playing In This Server.", message.channel);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .setAuthor("Now Playing")
      .setThumbnail(song.img)
      .setColor("#323131")
      .addField("Name", song.title, true)
      .addField("Duration", song.duration, true)
      .setFooter(`Requested by ${song.req.tag}`, message.author.displayAvatarURL())
    return message.channel.send(thing)
  },
};
