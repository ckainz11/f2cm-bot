import { Client } from "discord.js";
import ready from "./listeners/ready";
import dotenv from "dotenv";
import messageCreate from "./listeners/messageCreate";

dotenv.config();
const token = process.env.BOT_TOKEN;
export const timeChannelId = process.env.TIME_CHANNEL_ID

const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

ready(client);
messageCreate(client);

client.login(token);

console.log(client);