const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytdlDiscord = require("ytdl-core-discord");
const YouTube = require("youtube-sr");
const sendError = require("../util/error");
const fs = require("fs");

module.exports = {
    info: {
        name: "search",
        description: "To Search Songs :D",
        usage: "<song_name>",
        aliases: ["sc"],
    },

    run: async function (client, message, args) {
        let channel = message.member.voice.channel;
        if (!channel) return sendError("I'm Sorry But You Need To Be In A Voice Channel To Play Music!", message.channel);

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return sendError("I Cannot Connect To Your Voice Channel, Make Sure I Have The Proper Permissions!", message.channel);
        if (!permissions.has("SPEAK")) return sendError("I Cannot Speak In This Voice Channel, Make Sure I Have The Proper Permissions!", message.channel);

        var searchString = args.join(" ");
        if (!searchString) return sendError("You Didn't Poivide Want I Want To Search", message.channel);

        var serverQueue = message.client.queue.get(message.guild.id);
        try {
            var searched = await YouTube.search(searchString, { limit: 10 });
            if (searched[0] == undefined) return sendError("Looks Like I Was Unable To Find The Song On YouTube", message.channel);
            let index = 0;
            let embedPlay = new MessageEmbed()
                .setColor("#323131")
                .setAuthor(`Results For \"${args.join(" ")}\"`, message.author.displayAvatarURL())
                .setDescription(`${searched.map((video2) => `**\`${++index}\`  |** [\`${video2.title}\`](${video2.url}) - \`${video2.durationFormatted}\``).join("\n")}`)
                .setFooter("This Message Will Be Automatically Deleted After 20 Seconds.");
            message.channel.send(embedPlay).then((m) =>
                m.delete({
                    timeout: 15000,
                })
            );
            try {
                var response = await message.channel.awaitMessages((message2) => message2.content > 0 && message2.content < 11, {
                    max: 1,
                    time: 20000,
                    errors: ["time"],
                });
            } catch (err) {
                console.error(err);
                return message.channel.send({
                    embed: {
                        color: "#323131",
                        description: "Nothing Has Been Selected Within 20 Seconds, The Request Has Been Canceled.",
                    },
                });
            }
            const videoIndex = parseInt(response.first().content);
            var video = await searched[videoIndex - 1];
        } catch (err) {
            console.error(err);
            return message.channel.send({
                embed: {
                    color: "#323131",
                    description: "I Could Not Obtain Any Search Results",
                },
            });
        }

        response.delete();
        var songInfo = video;

        const song = {
            id: songInfo.id,
            title: Util.escapeMarkdown(songInfo.title),
            views: String(songInfo.views).padStart(10, " "),
            ago: songInfo.uploadedAt,
            duration: songInfo.durationFormatted,
            url: `https://www.youtube.com/watch?v=${songInfo.id}`,
            img: songInfo.thumbnail.url,
            req: message.author,
        };

        if (serverQueue) {
            serverQueue.songs.push(song);
            let thing = new MessageEmbed()
                .setAuthor("Song Has Been Added To Queue")
                .setThumbnail(song.img)
                .setColor("#323131")
                .addField("Name", song.title, true)
                .addField("Duration", song.duration, true)
                .setFooter(`Requested by ${song.req.tag}`, message.author.displayAvatarURL());
            return message.channel.send(thing);
        }

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: channel,
            connection: null,
            songs: [],
            volume: 80,
            playing: true,
            loop: false,
        };
        message.client.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        const play = async (song) => {
            const queue = message.client.queue.get(message.guild.id);
            if (!song) {
                sendError(
                );
                message.client.queue.delete(message.guild.id);
                return;
            }
            let stream = null;
            if (song.url.includes("youtube.com")) {
                stream = await ytdl(song.url);
                stream.on("error", function (er) {
                    if (er) {
                        if (queue) {
                            queue.songs.shift();
                            play(queue.songs[0]);
                            return sendError(`An Unexpected Error Has Occurred.\nPossible type \`${er}\``, message.channel);
                        }
                    }
                });
            }

            queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));
            const dispatcher = queue.connection.play(ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25, type: "opus" })).on("finish", () => {
                const shiffed = queue.songs.shift();
                if (queue.loop === true) {
                    queue.songs.push(shiffed);
                }
                play(queue.songs[0]);
            });

            dispatcher.setVolumeLogarithmic(queue.volume / 100);
            let thing = new MessageEmbed()
                .setAuthor("Started Playing Music!")
                .setThumbnail(song.img)
                .setColor("#323131")
                .addField("Name", song.title, true)
                .addField("Duration", song.duration, true)
                .setFooter(`Requested by ${song.req.tag}`, message.author.displayAvatarURL());
            queue.textChannel.send(thing);
        };

        try {
            const connection = await channel.join();
            queueConstruct.connection = connection;
            channel.guild.voice.setSelfDeaf(true);
            play(queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I Could Not Join The Voice Channel: ${error}`);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return sendError(`I Could Not Join The Voice Channel: ${error}`, message.channel);
        }
    },
};
