const utilsJs = require('./utils.js')
const discordInteractions = require('discord-interactions')
const express = require('express')
const axios = require('axios');
const { OpenAI } = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json({ verify: utilsJs.VerifyDiscordRequest(process.env.DISCORD_PUBLIC_KEY) }));


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    next()
});


app.get('/health', function (req, res) {
    res.json({ success: 'healthy!', url: req.url });
});

app.post('/discordgpt/interactions', async function (req, res) {
    console.log('interactionsHandler');
    // Interaction type and data
    const { type, id, data, token, application_id } = req.body;
    console.log(JSON.stringify(req.body));
    console.log(req.body.application_id);
    console.log(req.body.token);
    /**
     * Handle verification requests
     */
    if (type === discordInteractions.InteractionType.PING) {
        return res.send({ type: discordInteractions.InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === discordInteractions.InteractionType.APPLICATION_COMMAND) {
        const { name, options } = data;
        console.log(options);
        console.log(options[0].value);
        const discord_webhook_id = application_id;
        const discord_webhook_token = token;
        const discord_webhook_message_id = req.body.channel.last_message_id;

        // "gpt" command
        if (name === 'gpt') {

            try {
                // quick response
                let quickPayload = {
                    type: discordInteractions.InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
                };
                // axios post request
                let quickUrl = `https://discord.com/api/v10/interactions/${id}/${token}/callback`
                const quickAxiosOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                        'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
                    },
                    data: JSON.stringify(quickPayload),
                    url: quickUrl,
                };
                axios(quickAxiosOptions)
                    .then(function (response) {
                        console.log(`quick discordRes: ${response}`);
                    })
                    .catch(function (error) {
                        console.log(`quick err: ${error}`);
                        if (error.response) {
                            console.log(error.response.status);
                            console.log(error.response.data);
                        } else {
                            console.log(error.message);
                        }
                    });










                const response = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { "role": "system", "content": 'You are a helpful discord bot' },
                        { "role": "user", "content": options[0].value }
                    ]
                })

                console.log(`openai.createChatCompletion: ${response}`);
                console.log('before');
                // axios post request
                let url = `https://discord.com/api/v10/webhooks/${application_id}/${discord_webhook_token}`
                const axiosOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                        'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
                    },
                    data: JSON.stringify({
                        content: `Question: ${options[0].value}
Response:
${response.data.choices[0].message.content}`,
                    }),
                    url,
                };
                const gptResponse = await axios(axiosOptions)
                console.log(`gptResponse: ${gptResponse}`);
                return res.send(200);

                console.log('after');

            } catch (error) {
                if (error.response) {
                    console.log(error.response.status);
                    console.log(error.response.data);
                } else {
                    console.log(error.message);
                }
                return res.send({
                    type: discordInteractions.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: 'error running command ',
                    },
                });
            }
        }
    }
});

app.listen(PORT, function () {
    console.log(`app listening on port ${PORT}!`)
});


module.exports = app
