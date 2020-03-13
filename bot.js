const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config.json");
var Long = require("long");
const fs = require('fs');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus("invisible");

    setInterval(sendSoz, 17 * 60000); // sendSoz every 30mins

    setInterval(function () {
        client.guilds.cache.forEach(guild => {
            getDefaultChannel(guild).send('!?');
        });
    }, 13 * 60000);
});

client.on('message', async message => {
    if (message.content.indexOf(config.prefix) !== 0) return; // ignore any message that does not start with our prefix

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    //const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    console.log("command:" + command);
    console.log("args:" + args);
    if (command === "ping") {
        const m = await message.channel.send("hallediliyor...");
        m.edit(`komut ayıkma sürem ${m.createdTimestamp - message.createdTimestamp}ms, servera pingim ${Math.round(client.ping)}ms`);
    }

    if (command === "gel") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            message.channel.send('sa');
            await connection.play('./audio/sa.mp3');
        }
    }

    // AUDIO
    var audioCommands = [
        "harman",
        "alinir",
        "zurna",
        "anani",
        "hg",
        "mal",
        "adam",
        "gg",
        "sg",
        "ol",
        "hava",
        "baki",
        "cinema",
        "suda",
        "tox",
        "pick",
        "sevgi",
        "money",
        "semsi",
    ];
    if (audioCommands.includes(command)) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/' + command + '.mp3');
        }
    }
    // special case
    if (command === "?") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/soru.mp3');
        }
    }
    if (command === "konus") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            sendSoz(parseInt(args));
        }
    }


    if (command === "uza") {
        //voiceChannel = await message.member.voice.channel;
        if (message.guild.me.voice.channel.id === message.member.voice.channel.id) {
            const connection = await message.member.voice.channel.join();
            let dispatcher = connection.play('./audio/gul.ogg');
            await dispatcher.on('end', function () {
                message.member.voice.channel.leave();
            });
            //await message.member.voiceChannel.leave();
        } else {
            await message.channel.send("sebeb ?");
        }
        //connection = await voiceChannel.join();
        //await connection.leave();
    }

    message.delete({
        timeout: 30000
    }); // Delete commands from text channel after 10 secs
});


const getDefaultChannel = (guild) => {
    const generalChannel = guild.channels.cache.find(channel => channel.name === "general");
    if (generalChannel)
        return generalChannel;

    return guild.channels
        .filter(c => c.type === "text" &&
            c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
        .sort((a, b) => a.position - b.position ||
            Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
        .first();
}

const sendSoz = function (sozId) {
    let jsonfile = fs.readFileSync('sozler.json');
    let parsedJson = JSON.parse(jsonfile);

    client.guilds.cache.forEach(guild => {
        client.voice.connections.forEach(connection => {
            connection.play('./audio/klavye.mp3');
        });
        console.log("sozId:", sozId);
        // Pick random if no arg
        if (Number.isInteger(sozId) && sozId < parsedJson.sozler.length) {
            sozId = Math.floor(Math.random() * parsedJson.sozler.length);
        } else {
            client.voice.connections.forEach(connection => {
                connection.play('./audio/zurna.mp3');
            });
        }
        setTimeout(() => {
            getDefaultChannel(guild).send(parsedJson.sozler[sozId].text).then((sentMsg) => {
                sentMsg.delete({
                    timeout: 30000
                }); // Delete commands from text channel after 30 secs
            });
            client.voice.connections.forEach(connection => {
                connection.play(parsedJson.sozler[sozId].path);
            });
        }, 6400);
    });
};


client.on("voiceStateUpdate", async function (oldVoiceState, newVoiceState) {
    let newUserChannel = newVoiceState.member.voice.channel;
    let oldUserChannel = oldVoiceState.member.voice.channel;

    /*
    console.log("voiceStateUpdate: \n newUserChannel:" + newUserChannel + "\n oldUserChannel:" + oldUserChannel);
    console.log("voiceStateUpdate: \n oldMember:" + oldVoiceState + "\n newMember:" + newVoiceState);
    console.log("voiceStateUpdate: \n oldMember.guild:" + oldVoiceState.guild + "\n newMember.guild:" + newVoiceState.guild);
    */
    if (oldUserChannel === null && newUserChannel === null) { // User disconnected
        client.voice.connections.forEach(connection => {
            connection.play('./audio/sg/sg_tts.mp3');
        });
        //getDefaultChannel(oldVoiceState.guild).send('sıe'); // cok kotu workaround
    } else {
        const connection = await newUserChannel.join();
        await connection.play('./audio/hg_tts.mp3');
    }

});


client.login(process.env.TOKEN);