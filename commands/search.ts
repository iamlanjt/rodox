import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, CommandInteraction, EmbedBuilder, Interaction, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { query } from "../modules/searchUtil";
import { queryChunk } from "../interfaces/queryChunk";
import { parse } from "yaml";

const mainUrl = 'https://raw.githubusercontent.com/Roblox/creator-docs/main/content/en-us'

// Example entry
/**
name: WorldRoot
type: class
category:
memory_category: PhysicsParts
summary: |
  Base class for handling physics simulation and 3D spatial queries.
description: |
  This base class provides an API for any instance intended for handling 3D
  spatial queries and simulation, such as `Class.Workspace` and
  `Class.WorldModel`.
code_samples:
inherits:
  - Model
tags:
  - NotCreatable
deprecation_message: ''
properties: []
methods:
  - name: WorldRoot:ArePartsTouchingOthers
    summary: |
      Returns true if any of the given `Class.BasePart` are touching any other
      parts.
    description: |
      **ArePartsTouchingOthers** returns true if at least one of the given
      `Class.BasePart` are touching any other parts. Two parts are considered
      "touching" if they are within the distance threshold, `overlapIgnored`.

      If no parts are provided, false is returned.
    code_samples:
      - checking-for-touching-parts
    parameters:
      - name: partList
        type: Objects
        default:
        summary: |
          A list of parts checks to see if any parts in the list are touching
          any parts not in the list.
      - name: overlapIgnored
        type: float
        default: 0.000199999995
        summary: |
          The part overlap threshold in studs that is ignored before parts are
          considered to be touching.
    returns:
      - type: bool
        summary: |
          True if and only if any of the `Class.Part|parts` in `partList` are
          touching any other parts (parts not in the partList). False if no
          parts are passed.
    tags: []
    deprecation_message: ''
    security: None
    thread_safety: Unsafe
 */

export const command = new SlashCommandBuilder()
	.setName('search')
	.setDescription('Search the Roblox API documentation')
	.addStringOption(op=>
		op.setName('query')
		.setDescription('The query')
		.setMinLength(1)
		.setMaxLength(15)
		.setRequired(true))

function yamlToEmbed(yml: any) {
	const embed = new EmbedBuilder()
		.setTitle(`${yml.name}<${yml.type}>`)
		.setDescription(`${yml.name}\n@tags \| ${yml.tags}\n\n${yml.summary}\n\n${yml.description}`)
	return embed
}
	
export async function exec(client: Client, interaction: any) {
	const q = interaction.options.getString('query')

	const queryResults: any = await query(q, 8)
	const innerResults: queryChunk[] = queryResults.results

	let finalResults = ''
	const row = new ActionRowBuilder()
	const selectMenu = new StringSelectMenuBuilder()
	selectMenu.setCustomId('srchslct')
	for (let resultObj of innerResults) {
		const title = `${resultObj.title} (<${resultObj.documentationSubType}>)`
		const opt = new StringSelectMenuOptionBuilder()
			.setValue(`srch@${resultObj.resultTargetReference}`)
			.setLabel(title)
			.setDescription('Pick one to learn more about it')
		selectMenu.addOptions(opt)
	}
	row.addComponents(selectMenu)
	
	const msg = await interaction.reply({
		components: [row]
	})

	const collectorFilter = (i: any) => i.user.id === interaction.user.id

	try {
		const confirmation = await msg.awaitMessageComponent({ filter: collectorFilter, time: 60000 })
		const selectedValue = confirmation.values[0]

		// hello
		if ((selectedValue as string).startsWith('srch@')) {
			const target: string = (selectedValue as string).split('@')[1]

			const targetBlob = `${mainUrl}${target}.yaml`
			const fetched = await fetch(targetBlob)
			// vvv | Valid yaml file for documentation
			// console.log(await fetched.text())

			const parsedYaml = parse((await fetched.text()))
			await confirmation.update({
				embeds: [
					yamlToEmbed(parsedYaml)
				]
			})
		}
	} catch (e) {
		console.log(e)
		await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] })
	}
}