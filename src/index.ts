import {
    Client,
    EmbedBuilder,
    GatewayIntentBits,
    TextChannel,
} from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

const collectChannelId = process.env.COLLECT_CHANNEL_ID;
const botToken = process.env.BOT_TOKEN;

if (collectChannelId === undefined) {
    console.error("Channel ID is not specified.");
    process.exit(1);
}

const client: Client = new Client({
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
    if (message.author === client.user || message.member === null) return;

    const collectChannel = message.guild?.channels.cache.get(collectChannelId);
    if (collectChannel === undefined) return;

    if (!(collectChannel instanceof TextChannel)) return;

    const webhooks = await collectChannel.fetchWebhooks();
    const webhook =
        webhooks.find((wh) => wh.owner === client.user) ||
        (await collectChannel.createWebhook({ name: "chat-collector" }));

    const description = message.content === "" ? null : message.content;
    const imageUrl =
        message.attachments.find(
            (a) => a.contentType?.match(/image\/.*/) != null
        )?.url || null;
    if (description === null && imageUrl === null) return;

    const embed = new EmbedBuilder()
        .setAuthor({
            name: message.member.displayName,
            iconURL: message.member.displayAvatarURL() || undefined,
        })
        .setDescription(description)
        .addFields([
            {
                name: "Channel",
                value: `<#${message.channel.id}>`,
                inline: true,
            },
            {
                name: "Jump",
                value: `[Click here](${message.url})`,
                inline: true,
            },
        ])
        .setImage(imageUrl)
        .setTimestamp();

    await webhook.send({
        username: "Gyotaku",
        avatarURL:
            "https://1.bp.blogspot.com/-ztMJJI7R2-M/WQA9_fgWESI/AAAAAAABD4Q/x8kHmIQRAzgy24MTK0zNMYEUTyXN_vS1QCLcB/s400/fishing_gyotaku.png",
        embeds: [embed],
        allowedMentions: { repliedUser: false },
    });
});

client.on("error", console.error);

client.login(botToken);
