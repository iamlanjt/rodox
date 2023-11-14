import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('A ping command, what more do you want')

export async function exec(client: Client, interaction: CommandInteraction) {
	await interaction.reply('Pong!')
}