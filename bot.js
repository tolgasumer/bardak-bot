const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config.json");
var Long = require("long");
const fs = require('fs');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus("invisible");



    let jsonfile = fs.readFileSync('sozler.json');
    let sozler = JSON.parse(jsonfile);
    console.log(sozler);
    setInterval(function () {
        client.guilds.cache.forEach(guild => {
            getDefaultChannel(guild).send(sozler[5]);
        });
    }, 1 * 60000);

    setInterval(function () {
        client.guilds.cache.forEach(guild => {
            getDefaultChannel(guild).send('!?');
        });
    }, 13 * 60000);
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
        "sg",
        "adam",
        "gg",
        "ol",
        "hava",
        "baki",
        "cinema",
        "suda",
        "tox",
        "pick",
        "sevgi",
        "money",
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
        timeout: 10000
    }); // Delete commands from text channel after 5 secs
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
async function baskinYap(voiceChannel) {
    connection = await voiceChannel.join();
    let dispatcher = connection.play('./audio/bamboozle.ogg');
    await dispatcher.on('end', async function () {
        let dispatcher1 = connection.play('./audio/zurna.ogg');
        await dispatcher1.on('end', async function () {
            let dispatcher2 = connection.play('./audio/gul.ogg');
            await dispatcher2.on('end', function () {
                voiceChannel.leave();
            });
        });

    });

}

const getDefaultChannel = (guild) => {
    // Check for a "general" channel, which is often default chat
    const generalChannel = guild.channels.cache.find(channel => channel.name === "general");
    if (generalChannel)
        return generalChannel;
    // Now we get into the heavy stuff: first channel in order where the bot can speak
    // hold on to your hats!
    return guild.channels
        .filter(c => c.type === "text" &&
            c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
        .sort((a, b) => a.position - b.position ||
            Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
        .first();
}

client.on("voiceStateUpdate", async function (oldMember, newMember) {
    let newUserChannel = newMember.member.voice.channel;
    let oldUserChannel = oldMember.member.voice.channel;

    console.log("voiceStateUpdate: \n newUserChannel:" + newUserChannel + "\n oldUserChannel:" + oldUserChannel);
    //console.log("newMember.guild.channels:", newMember.guild.channels);
    console.log("voiceStateUpdate: \n oldMember:" + oldMember + "\n newMember:" + newMember);
    console.log("voiceStateUpdate: \n oldMember.guild:" + oldMember.guild + "\n newMember.guild:" + newMember.guild);
    if (oldUserChannel === null && newUserChannel === null) { // User disconnected
        getDefaultChannel(newMember.guild).send('!sg'); // cok kotu workaround
    } else {
        const connection = await newUserChannel.join();
        await connection.play('./audio/hg.mp3');
    }


    /*
    // Send message to the first channel the bot is allowed to send to
    console.log("newMember.guild.channels:", newMember.guild.channels);
    const channel = getDefaultChannel(newMember.guild);
    channel.send(`-p https://www.youtube.com/watch?v=3O_TfFsnJ8U`);
    */

});


client.login(process.env.TOKEN);