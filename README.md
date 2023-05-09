# shusekijo

Discord bot that enables to see all chat in a single channel

## Feature

You can check all messages in a Discord server just by seeing one channel!
That will be useful if you are tired of scrolling many channels.

## Deploy with docker-compose

Create `docker-compose.yml` with the following content:

```yaml
version: "3.8"

services:
  app:
    build: https://github.com/nutchinet/shusekijo.git
    environment:
      - BOT_TOKEN
      - COLLECT_CHANNEL_ID
```

You need to configure the environment variables. (e.g. using `.env` file)

Then do `docker compose up -d` to deploy.

## Setting in Discord

- Make `Message Content Intent` enabled in the Developer Portal.
- Allow the bot to manage webhooks in the channel where you want to see messages.
