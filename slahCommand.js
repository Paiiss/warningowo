import { REST, Routes, ApplicationCommandOptionType } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "alert",
    description: "Alerts when you are detected as a bot by OwO",
    options: [
      {
        name: "type",
        type: ApplicationCommandOptionType.Boolean,
        description: "The type of alert",
        required: true,
        choices: [
          {
            name: "enable",
            value: true,
          },
          {
            name: "disable",
            value: false,
          },
        ],
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
