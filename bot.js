const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config.json");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
    if (message.content.indexOf(config.prefix) !== 0) return; // ignore any message that does not start with our prefix

    // command = say
    // args = ["Is", "this", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        const m = await message.channel.send("hallediliyor...");
        m.edit(`komut ayıkma sürem ${m.createdTimestamp - message.createdTimestamp}ms, servera pingim ${Math.round(client.ping)}ms`);
    }

    if (command === "gel") {
        message.channel.send('sa');
        voiceChannel = message.member.voiceChannel;
        connection = await voiceChannel.join();
        await connection.playFile('./audio/sa.ogg');
    }
    if (command === "uza") {
        //voiceChannel = message.member.voiceChannel;
        if (message.guild.me.voiceChannel !== undefined) {
            await connection.playFile('./audio/gul.ogg');
            message.guild.me.voiceChannel.leave();
        } else {
            message.reply("sebeb ?");
        }
        //connection = await voiceChannel.join();
        //await connection.leave();
    }
});

client.login(config.token);