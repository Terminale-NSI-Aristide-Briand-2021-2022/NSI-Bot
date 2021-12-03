import { CommandInteraction, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

import { Bot, Command } from '../../utils';

export default new Command(
	{
		name: 'last-subject',
		description: 'Get the last forum subject',
	},
	async (client: Bot, interaction: CommandInteraction) => {
		let last = (await (await fetch(process.env.MOODLE_LINK + '/mod/forum/view.php?id=93')).text()).split('<tr class="discussion r')[1];

		const sujet = last.split(`<td class="topic starter">`)[1].split('</td>')[0];
		const url = sujet.split(`<a href="`)[1].split(`">`)[0];
		const titre = sujet.split('>')[1].split('</')[0];
		const authorInfo = last.split(`<td class="author">`)[1].split('</td>')[0];
		const authorName = authorInfo.split(`<div class="media-body">`)[1].split('</div>')[0].split('">')[1].split('</a>')[0];
		const authorPP = authorInfo.split(`<span class="pull-left">`)[1].split('</span>')[0].split(`<img src="`)[1].split(`"`)[0];

		const description =
			(await (await fetch(url)).text())
				.split(`<div class="posting fullpost">`)[1]
				.split(`<div class="attachedimages">`)[0]
				.replace(/<p>/g, '')
				.replace(/<\/p>/g, '\n')
				.replace(/<br \/>/g, '\n')
				.replace(/<p align="left">/, '')
				.replace(/&gt;/g, '>')
				.replace(/<b>/g, "**")
				.replace(/<\/b>/g, "**") + `\n[Lien](${url})\n<:Nothing:888076372981993512>`;

		const embed = new MessageEmbed({
			author: {
				name: `Le dernier sujet du forum`,
				url: url,
			},
			title: titre,
			description,
			footer: {
				text: `Par ${authorName}`,
				iconURL: authorPP,
			},
			color: authorName === 'Yann Bertrand' || authorName === 'Jérôme Cantaloube' ? 'RED' : 'DARK_PURPLE',
		});
		interaction.reply({ embeds: [embed] });
	}
);
