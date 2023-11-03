const utilsJs = require('./utils.js')
const discordInteractions = require('discord-interactions')
const express = require('express')
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const PORT = process.env.PORT || 3000
const { splitNames, teamsToString, groupNames } = require('./random-team-gen.js');

const app = express()
app.use(express.json({ verify: utilsJs.VerifyDiscordRequest(process.env.DISCORD_PUBLIC_KEY) }));


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    next()
});


app.get('/health', function (req, res) {
    console.log('health');
    res.json({ success: 'healthy!', url: req.url });
});

// Middleware function
const myMiddleware = (req, res, next) => {
    // Do something before the route handler
    console.log('Middleware executed');

    // Call the next middleware or route handler
    next();
};

app.get('/middleware-test', myMiddleware, function (req, res) {
    console.log('middleware-test');
    res.json({ success: 'middleware-testy!', url: req.url });
});

app.post('/discordgpt/interactions', async function (req, res) {
    console.log('interactionsHandler');
    // Interaction type and data
    const { type, id, data, token, application_id } = req.body;
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
                let quickUrl = `https://discord.com/api/v10/interactions/${id}/${token}/callback`
                const quickDiscordResponse = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                        'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
                    },
                    data: JSON.stringify(quickPayload),
                    url: quickUrl,
                };
                axios(quickDiscordResponse)
                    .then(function (response) {
                        console.log(`quick discordRes: ${typeof response}`);
                    })
                    .catch(function (error) {
                        console.log(`quick err: ${error}`);
                        if (error.response) {
                            console.log(`quick err: ${error.response.status}`);
                            console.log(`quick err: ${JSON.stringify(error.response.data)}`);
                        } else {
                            console.log(`quick err: ${error.message}`);
                        }
                    });
                const response = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { "role": "system", "content": 'You are a helpful discord bot' },
                        { "role": "user", "content": options[0].value }
                    ]
                })
                // axios post request
                let url = `https://discord.com/api/v10/webhooks/${application_id}/${discord_webhook_token}`
                console.log(`url: ${url}`);
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
                try {
                    const gptResponse = await axios(axiosOptions)
                    console.log(`gptResponse: ${gptResponse}`);

                } catch (error) {
                    console.log(`gptresponse error: ${error}`);
                    if (error.response) {
                        console.log(`gptresponse error: ${error.response.status}`);
                        console.log(`gptresponse error: ${JSON.stringify(error.response.data)}`);
                    } else {
                        console.log(`gptresponse error: ${error.message}`);
                    }
                }
                return res.send(200);

            } catch (error) {
                console.log(`gpt try: ${error}`);
                if (error.response) {
                    console.log(`quick err: ${error.response.status}`);
                    console.log(`quick err: ${JSON.stringify(error.response.data)}`);
                } else {
                    console.log(`quick err: ${error.message}`);
                }
                return res.send({
                    type: discordInteractions.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: 'error running command ',
                    },
                });
            }
        }

        if (name === 'ping') {
            return res.send({
                type: discordInteractions.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'Pong!',
                },
            });
        }
        if (name === 'random-team') {
            console.log(`options: ${JSON.stringify(options)}`);
            const names = splitNames(options[0].value);
            const numGroups = options[1].value;
            const result = groupNames(names, numGroups);
            return res.send({
                type: discordInteractions.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `Random-Team! 🎲🔀
${teamsToString(result)}`,
                },
            });
        }
    }
});






const crypto = require('crypto')

// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = 'sha256=';


app.use('/eventsub', express.raw({
    type: 'application/json'
}))


app.post('/eventsub', (req, res) => {
    let secret = getSecret();
    let message = getHmacMessage(req);
    let hmac = HMAC_PREFIX + getHmac(secret, message);  // Signature to compare

    if (true === verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
        console.log("signatures match");

        // Get JSON object from body, so you can process the message.
        let notification = JSON.parse(req.body);

        if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
            // TODO: Do something with the event's data.

            console.log(`Event type: ${notification.subscription.type}`);
            console.log(JSON.stringify(notification.event, null, 4));

            res.sendStatus(204);
        }
        else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
            res.set('Content-Type', 'text/plain').status(200).send(notification.challenge);
        }
        else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
            res.sendStatus(204);

            console.log(`${notification.subscription.type} notifications revoked!`);
            console.log(`reason: ${notification.subscription.status}`);
            console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
        }
        else {
            res.sendStatus(204);
            console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
        }
    }
    else {
        console.log('403');    // Signatures didn't match.
        res.sendStatus(403);
    }
})



function getSecret() {
    return process.env.TWITCH_EVENTSUB_SECRET;
}

// Build the message used to get the HMAC.
function getHmacMessage(request) {
    return (request.headers[TWITCH_MESSAGE_ID] +
        request.headers[TWITCH_MESSAGE_TIMESTAMP] +
        request.body);
}

// Get the HMAC.
function getHmac(secret, message) {
    return crypto.createHmac('sha256', secret)
        .update(message)
        .digest('hex');
}

// Verify whether your signature matches Twitch's signature.
function verifyMessage(hmac, verifySignature) {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}



app.listen(PORT, function () {
    console.log(`app listening on port ${PORT}!`)
});


module.exports = app
