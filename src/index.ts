import {
    Channel,
    Client,
    Collection,
    Intents,
    Snowflake,
    TextChannel,
    Webhook,
} from "discord.js";
import log4js from "log4js";
import * as dotenv from "dotenv";

const logger = log4js.getLogger();
logger.level = "info";

dotenv.config();

const collectChannelId: string | undefined = process.env.COLLECT_CHANNEL_ID;
const botToken: string | undefined = process.env.BOT_TOKEN;

if (collectChannelId === undefined) {
    logger.error("Channel ID is not specified.");
    process.exit(1);
}
if (botToken === undefined) {
    logger.error("Bot token is not specified.");
    process.exit(1);
}

const bot: Client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_WEBHOOKS,
    ],
});

bot.on("ready", (bot) => {
    logger.info(
        `Logged in as ${bot.user.username} on ${bot.guilds.cache.size} servers.`
    );
    bot.user.setPresence({
        activities: [{ name: "chat-collector" }],
        status: "online",
    });
});

bot.on("messageCreate", async (message) => {
    if (message.channel.type === "DM") return;
    if (message.author === bot.user) return;
    if (message.channel.id === collectChannelId) return;

    if (
        message.content === "" &&
        message.embeds.length === 0 &&
        message.attachments.size === 0
    ) {
        return;
    }
    if (message.member === null) return;

    const collectChannel: Channel | undefined =
        message.guild?.channels.cache.get(collectChannelId);
    if (collectChannel === undefined) return;

    if (!(collectChannel instanceof TextChannel)) return;
    const webhooks: Collection<Snowflake, Webhook> =
        await collectChannel.fetchWebhooks();

    let webhook: Webhook | undefined = webhooks.find(
        (wh) => wh.owner === bot.user
    );
    if (webhook === undefined) {
        webhook = await collectChannel.createWebhook("chat-collector");
    }

    await webhook
        .send({
            content: message.content === "" ? undefined : message.content,
            username: message.member.displayName,
            avatarURL: message.member.displayAvatarURL(),
            embeds: message.embeds,
            files: Array.from(message.attachments.values()),
            allowedMentions: { repliedUser: false },
        })
        .catch((error) => logger.error(error));
});

bot.login(botToken);
