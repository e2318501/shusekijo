# chat-collector

Discord bot that enables to see all chat in a single channel

## Feature

You can check all messages in a Discord server just by seeing one channel! That will be useful if you are tired of scrolling and clicking too much but just want to feel activity of a server.<br>

### How it works

When someone sends a message in a server, the bot sends a Webhook message with the same appearance (content, username, and avatar) as it, to a single channel.<br>
You can specify the channel with an environment variable.

## Running a bot

### Heroku

Click the button below and configure environment variables.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Docker

Build a Docker image:

```sh
cd chat-collector/
docker build -t chat-collector .
```

Run a container with environment variables:

```sh
docker run -d -e BOT_TOKEN=<your bot token> -e COLLECT_CHANNEL_ID=<channel id> --name chat-collector chat-collector
```

### Local

> You need to install [Node.js](https://nodejs.org/en/download/) and npm.

Configure environment variables. You can use `.env` file:

```sh
cd chat-collector/
vim .env
# BOT_TOKEN=<your bot token>
# COLLECT_CHANNEL_ID=<channel id>
```

Build and run:

```sh
npm install && npm run build && npm prune --production
npm start
```

## Setting in Discord

### Developer Portal

In your app page, go to `Bot` and turn on `Message Content Intent`.

### Permission

Check `Manage Webhooks` in the channel setting as the bot uses webhook to send messages.

### Ignoring specific channels

Limit channels the bot can see, and messages there will be ignored.
