const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config.json");
var Long = require("long");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus("invisible");
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
            await connection.play('./audio/sa.ogg');
        }
    }
    if (command === "harman") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/harman.mp3');
        }
    }
    if (command === "alinir") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/alinircubuklu.mp3');
        }
    }
    if (command === "zurna") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/zurna.ogg');
        }
    }
    if (command === "anani") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/anani.ogg');
        }
    }
    if (command === "hg") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/hg.ogg');
        }
    }
    if (command === "mal") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/mal.ogg');
        }
    }
    if (command === "sg") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/sg.ogg');
        }
    }
    if (command === "adam") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/adam.ogg');
        }
    }
    if (command === "gg") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/gg.mp3');
        }
    }
    if (command === "ol") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/ol.mp3');
        }
    }
    if (command === "hava") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/hava.mp3');
        }
    }
    if (command === "?") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/soru.mp3');
        }
    }
    if (command === "baki") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play('./audio/bakisine.mp3');
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
    const generalChannel = guild.channels.find(channel => channel.name === "general");
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

    const connection = await newUserChannel.join();
    await connection.play('./audio/hg.ogg');

    // Send message to the first channel the bot is allowed to send to
    const channel = getDefaultChannel(newMember.guild);
    channel.send(`-p https://www.youtube.com/watch?v=3O_TfFsnJ8U`);

});


client.login(process.env.TOKEN);