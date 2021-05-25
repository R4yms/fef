const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "skipto",
    description: "Skip To The Selected Queue Number",
    usage: "skipto <number>",
    aliases: ["skiptosong", "skiptomusic"],
  },

  run: async function (client, message, args) {
    if (!args.length || isNaN(args[0]))
      return message.channel.send({
                        embed: {
                            color: "#323131",
                            description: `**Usage**: \`${client.config.prefix}skipto <number>\``
                        }
   
                   }).catch(console.error);
        

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("There Is No Queue.",message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(`The Queue Is Only ${queue.songs.length} Songs Long!`,message.channel).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
     try{
    queue.connection.dispatcher.end();
      }catch (error) {
        queue.voiceChannel.leave()
        message.client.queue.delete(message.guild.id);
       return sendError(`The Player Has Stopped And The Queue Has Been Cleared.: ${error}`, message.channel);
      }
    
    queue.textChannel.send({
                        embed: {
                            color: "#323131",
                            description: `${message.author} ⏭ Skipped \`${args[0] - 1}\` Songs`
                        }
   
                   }).catch(console.error);
                   message.react("✅")

  },
};
