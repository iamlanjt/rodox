import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { clientId, guildId } from "./config.json"
import { query } from "./modules/searchUtil";
import { join } from "path";
import { readdirSync } from "fs";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds
	]
})
export const clientCommands = new Collection()
const jsonCommands = []

client.once(Events.ClientReady, (c) => {
	console.log(c.user.username, 'is ready!')
})

// Handle slash commands

const commandsPath = join(import.meta.dir, 'commands')
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts'))

for (const file of commandFiles) {
	const filePath = join(commandsPath, file)
	const command = await import(filePath)
	
	if ('command' in command && 'exec' in command) {
		clientCommands.set(command.command.name, command)
		jsonCommands.push(command.command.toJSON())
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN!);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${jsonCommands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data: any = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: jsonCommands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command: any = clientCommands.get(interaction.commandName)

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.exec(client, interaction)
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
})

client.login(process.env.TOKEN)