const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config.json");
var Long = require("long");
const fs = require('fs');
const ytdl = require('ytdl-core');
const axios = require('axios')
const qs = require('querystring')

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus("online");
    client.user.setActivity("oYunYöNetıCısı - conter strıek 1.5", { type: "PLAYING"})

    setInterval(sendSoz, 55 * 60000); // sendSoz every 55mins
    setInterval(covidAnons, 60 * 60000); // covidAnons every 60mins

    setInterval(function () {
        client.guilds.cache.forEach(guild => {
            getDefaultChannel(guild).send('!?');
        });
    }, 23 * 60000);
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
            let response = await message.channel.send('sa');
            //scrollingText(response);
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
        "cp",
        "gul",
        "ow",
        "faceit",
        "covidanons",
        "kapi",
        "panic",
        "lucenzo",
        "korna",
        "sanat",
        "lowhp",
        "maymun",
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
            let dispatcher = connection.play('./audio/gul.mp3');
            dispatcher.on('end', function () {
                connection.disconnect();
            });
            //await message.member.voiceChannel.leave();
        } else {
            await message.channel.send("sebeb ?");
        }
        //connection = await voiceChannel.join();
        //await connection.leave();
    }

    // Help commands
    if (command === "sozler") {
        let jsonfile = fs.readFileSync('sozler.json');
        let parsedJson = JSON.parse(jsonfile);
        const m = await getDefaultChannel(message.guild).send("baKıLıoR ...");
        let sozlerString = "";
        for (let i = 0; i < parsedJson.sozler.length; i++) {
            sozlerString += "\n" + i + ": " + parsedJson.sozler[i].text;
        }

        m.edit(sozlerString);
    }
    if (command === "sesler") {
        await message.channel.send(audioCommands.toString());
    }

    // Youtube
    if (command === "cal") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            await connection.play(ytdl(args[0], {
                filter: 'audioonly'
            }));
        }
    }

    // generateMeme
    if (command === "monte") {
        result = await generateMeme(args.join(' '));
        const attachment = new Discord.MessageAttachment(result);
        sentMsg = await message.channel.send(attachment);
        //sentMsg = await message.channel.send(result);
        sentMsg.delete({
            timeout: 30000
        }); // Delete sentMsg from text channel after 30 secs
    }


    message.delete({
        timeout: 30000
    }); // Delete commands from text channel after 10 secs
});


const getDefaultChannel = (guild) => {
    const generalChannel = guild.channels.cache.find(channel => channel.name === "general");
    if (generalChannel)
        return generalChannel;

    return guild.channels.cache
        .filter(c => c.type === "text" &&
            c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
        .sort((a, b) => a.position - b.position ||
            Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
        .first();
}

const sendSoz = function (sozId) {
    let jsonfile = fs.readFileSync('sozler.json');
    let parsedJson = JSON.parse(jsonfile);

    console.log("sozId:" + sozId);
    client.guilds.cache.forEach(guild => {
        client.voice.connections.forEach(connection => {
            connection.play('./audio/klavye.mp3');
        });

        // Pick random if no arg
        if (Number.isNaN(sozId) || sozId === undefined) {
            sozId = Math.floor(Math.random() * parsedJson.sozler.length);
        }
        if (Number.isInteger(sozId) && parsedJson.sozler.length <= sozId) {
            // ERROR
            client.voice.connections.forEach(connection => {
                connection.play('./audio/zurna.mp3');
            });
            return;
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
        }, 7000);
    });
};

const scrollingText = function (message) {
    setInterval(() => {
        if (message) {
            message.edit("." + message.content);
        }
    }, 500);
};

const covidAnons = function () {
    client.guilds.cache.forEach(guild => {
        client.voice.connections.forEach(connection => {
            connection.play('./audio/covidanons.mp3');
        });
    });
};

const generateMeme = async function (message) {
    const requestBody = {
        username: process.env.IMGFLIP_USERNAME,
        password: process.env.IMGFLIP_PASSWORD,
        text0: '',
        text1: message,
        template_id: '235198879',
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      
      result = await axios.post('https://api.imgflip.com/caption_image', qs.stringify(requestBody), config);
      console.log("generateMeme():", result.data.data.url);
      return result.data.data.url;
      /*
      axios.post('https://api.imgflip.com/caption_image', qs.stringify(requestBody), config)
        .then((result) => {
          return result.data.url;
        })
        .catch((err) => {
          return err;
        })*/
};


client.on("voiceStateUpdate", async function (oldVoiceState, newVoiceState) {
    let newUserChannel = newVoiceState.member.voice.channel;
    let oldUserChannel = oldVoiceState.member.voice.channel;

    console.log("voiceStateUpdate: \n oldVoiceState:" + oldVoiceState + "\n newVoiceState:" + newVoiceState);
    console.log("voiceStateUpdate: \n newUserChannel:" + newUserChannel + "\n oldUserChannel:" + oldUserChannel);

    if (oldUserChannel === null && newUserChannel === null) { // User disconnected
        client.voice.connections.forEach(connection => {
            connection.play('./audio/sg/sg_tts.mp3');
        });
        //getDefaultChannel(oldVoiceState.guild).send('sıe'); // cok kotu workaround
    } else { // User Joins a voice channel
        if (!newVoiceState.member.voice.selfMute) { // If the stateUpdate isn't a mute/unmute action
            const connection = await newUserChannel.join();
            if (newVoiceState.member.user.username == 'Musti') {
                await connection.play('./audio/hg/ihsan.mp3');
            } else if (newVoiceState.member.user.username == 'englourious') {
                await connection.play('./audio/hg/semsi.mp3');
            } else if (newVoiceState.member.user.username == 'darthling') {
                await connection.play('./audio/zurna.mp3');
            } else if (newVoiceState.member.user.username == 'rebbyy') {
                await connection.play('./audio/hg/baki.mp3');
            } else if (newVoiceState.member.user.username == 'Sina') {
                await connection.play('./audio/hg/sina.mp3');
            } else if (newVoiceState.member.user.username == 'ThukydeS') {
                await connection.play('./audio/hg/thukydes.mp3');
            } else if (newVoiceState.member.user.username == 'kerem') {
                await connection.play('./audio/hg/muhsin.mp3');
            } else if (newVoiceState.member.user.username == 'ıDRıS') {
                await connection.play('./audio/hg/idris.mp3');
            } else if (newVoiceState.member.user.username == 'KRAUSKON') {
                await connection.play('./audio/hg/hamza.mp3');
            } else if (newVoiceState.member.user.username == 'Atakan') {
                await connection.play('./audio/hg/fiko.mp3');
            } else if (newVoiceState.member.user.username == 'MiyaW') {
                await connection.play('./audio/cinema.mp3');
            } else if (newVoiceState.member.user.username == 'Voidwalker') {
                await connection.play('./audio/cp.mp3');

            } else {
                if (!newVoiceState.member.user.bot) {
                    await connection.play('./audio/hg_tts.mp3');
                }
            }
        }



        //hg test
        //console.log("newVoiceState.member", newVoiceState.member);

    }

});


client.login(process.env.TOKEN);