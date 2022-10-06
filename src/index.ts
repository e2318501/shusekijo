import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

const collectChannelId = process.env.COLLECT_CHANNEL_ID;
const botToken = process.env.BOT_TOKEN;

if (collectChannelId === undefined) {
    console.error("Channel ID is not specified.");
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("ready", (bot) => {
    console.info(
        `Logged in as ${bot.user.username} on ${bot.guilds.cache.size} servers.`
    );
    bot.user.setPresence({
        activities: [{ name: "chat-collector" }],
        status: "online",
    });
});

client.on("messageCreate", async (message) => {
    if (message.author === client.user) return;
    if (message.channel.id === collectChannelId) return;

    const isEmpty = () =>
        message.content === "" &&
        message.embeds.length === 0 &&
        message.attachments.size === 0;

    let timeout = false;
    setTimeout(() => {
        timeout = true;
    }, 1000);

    while (isEmpty() && !timeout) {
        await new Promise((r) => setTimeout(r, 10));
    }

    if (isEmpty()) return;

    const collectChannel = message.guild?.channels.cache.get(collectChannelId);
    if (collectChannel === undefined) return;

    if (!(collectChannel instanceof TextChannel)) return;

    try {
        const webhooks = await collectChannel.fetchWebhooks();
        const webhook =
            webhooks.find((wh) => wh.owner === client.user) ||
            (await collectChannel.createWebhook({ name: "chat-collector" }));

        await webhook.send({
            content: message.content === "" ? undefined : message.content,
            username: message.member?.displayName,
            avatarURL: message.member?.displayAvatarURL(),
            embeds: message.embeds,
            files: Array.from(message.attachments.values()),
            allowedMentions: { repliedUser: false },
        });
    } catch (error) {
        console.error(error);
    }
});

client.login(botToken);
