const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config.json");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
    if (message.content.indexOf(config.prefix) !== 0) return; // ignore any message that does not start with our prefix

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
    if (command === "alinir") {
        voiceChannel = message.member.voiceChannel;
        connection = await voiceChannel.join();
        await connection.playFile('./audio/alinircubuklu.mp3');
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
async function baskinYap(voiceChannel) {
    connection = await voiceChannel.join();
    let dispatcher = connection.playFile('./audio/bamboozle.ogg');
    await dispatcher.on('end', async function () {
        let dispatcher1 = connection.playFile('./audio/gul.ogg');
        await dispatcher1.on('end', function () {
            voiceChannel.leave();
        });
    });

}
client.on("voiceStateUpdate", async function (oldMember, newMember) {
    if (!newMember.user.bot) {
        randomInt = await getRandomInt(10 * 1000, 360 * 1000);
        setTimeout(baskinYap, randomInt, newMember.voiceChannel);
    }
    console.log(newMember);
    console.log(`a user changes voice state`);
});


client.login(config.token);