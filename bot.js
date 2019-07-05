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
    if (command === "harman") {
        voiceChannel = message.member.voiceChannel;
        connection = await voiceChannel.join();
        await connection.playFile('./audio/harman.mp3');
    }
    if (command === "uza") {
        voiceChannel = await message.member.voiceChannel;
        if (message.guild.me.voiceChannel.id === message.member.voiceChannel.id) {
            let dispatcher = message.member.voiceChannel.connection.playFile('./audio/gul.ogg');
            await dispatcher.on('end', function () {
                message.member.voiceChannel.leave();
            });
            //await message.member.voiceChannel.leave();
        } else {
            await message.channel.send("sebeb ?");
        }
        //connection = await voiceChannel.join();
        //await connection.leave();
    }
});

async function baskinYap(voiceChannel) {
    connection = await voiceChannel.join();
    let dispatcher = connection.playFile('./audio/gul.ogg');
    await dispatcher.on('end', function () {
        voiceChannel.leave();
    });
}
client.on("voiceStateUpdate", async function (oldMember, newMember) {
    //setTimeout(baskinYap, 10000, newMember.voiceChannel);
    console.log(newMember);
    console.log(`a user changes voice state`);
});


client.login(config.token);