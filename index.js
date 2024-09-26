import { Client, GatewayIntentBits } from "discord.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const active_user = [];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const getActive = JSON.parse(fs.readFileSync("./data/active.json"));
  active_user.push(...getActive);

  client.user.setActivity("OwO", { type: "WATCHING" });

  setInterval(() => {
    fs.writeFileSync("./data/active.json", JSON.stringify(active_user));
  }, 60000);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }

  if (interaction.commandName === "alert") {
    if (interaction.options.get("type").value) {
      if (active_user.includes(interaction.user.id))
        interaction.reply("You are already active");
      active_user.push(interaction.user.id);
      return interaction.reply(
        "We will remind you when OwO asks for a captcha"
      );
    } else {
      if (!active_user.includes(interaction.user.id))
        interaction.reply("You are already inactive");
      const index = active_user.indexOf(interaction.user.id);
      active_user.splice(index, 1);

      return interaction.reply(
        "You will no longer be reminded when OwO asks for a captcha"
      );
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.id != "408785106942164992") return;
  if (active_user.includes(message.mentions.users.first().id)) {
    if (
      message.content.match(
        /human|captcha|dm|banned|https:\/\/owobot.com\/captcha/g
      )
    ) {
      const user = await client.users.fetch(message.mentions.users.first());
      if (!user) {
        console.log("User not found");
        return;
      }

      return user.send(
        "Hello, It looks like you were detected as a bot by OwO."
      );
    }
  }
});

client.login(process.env.TOKEN);
