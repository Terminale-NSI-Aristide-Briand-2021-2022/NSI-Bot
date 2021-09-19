import {CommandInteraction, MessageEmbed} from 'discord.js';
import {Command, Bot} from '../../utils/class';
import fetch from 'node-fetch';

export default new Command(
	{
		name: 'last-subject',
		description: 'Get the last forum subject',
	},
	async (client: Bot, interaction: CommandInteraction) => {
		let last = (await (await fetch(process.env.MOODLE_LINK + '/mod/forum/view.php?id=93')).text()).split('<tr class="discussion r')[1];

		// We get the date and we handle it to change it as a timestamp
		let dateStr = last.split('>')[27];
		let dateTab = dateStr.split(' ');
		let hourTab = dateTab[4].split(':');
		let mounth = dateTab[2]
			.replace('janv.', '0')
			.replace('fébr.', '1')
			.replace('mars', '2')
			.replace('avril', '3')
			.replace('mai', '4')
			.replace('juin', '5')
			.replace('juil.', '6')
			.replace('aout', '7')
			.replace('sept.', '8')
			.replace('oct.', '9')
			.replace('nov.', '10')
			.replace('déc', '11');
		const dateRss =
			new Date(
				Number(dateTab[3].replace(',', '')),
				Number(mounth),
				Number(dateTab[1]),
				Number(hourTab[0]) - 2,
				Number(hourTab[1].replace('</a', ''))
			).getTime() + 9999;

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
				.replace(/<br \/>/g, '\n') + `\n[Lien](${url})\n<:Nothing:888076372981993512>`;

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
		interaction.reply({embeds: [embed]});
	}
);
