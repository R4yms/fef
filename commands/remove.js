const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "remove",
    description: "Remove Song From The Queue",
    usage: "rm <number>",
    aliases: ["rm"],
  },

  run: async function (client, message, args) {
   const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("There Is No queue.",message.channel).catch(console.error);
    if (!args.length) return sendError(`Usage: ${client.config.prefix}\`remove <Queue Number>\``);
    if (isNaN(args[0])) return sendError(`Usage: ${client.config.prefix}\`remove <Queue Number>\``);
    if (queue.songs.length == 1) return sendError("There Is No Queue.",message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(`The Queue Is Only ${queue.songs.length} songs long!`,message.channel).catch(console.error);
try{
    const song = queue.songs.splice(args[0] - 1, 1); 
    sendError(` Removed: **\`${song[0].title}\`** From The queue.`,queue.textChannel).catch(console.error);
                   message.react("✅")
} catch (error) {
        return sendError(`An Unexpected Error O  ccurred.\nPossible type: ${error}`, message.channel);
      }
  },
};
