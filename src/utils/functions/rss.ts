import { MessageEmbed, TextChannel } from 'discord.js';
import fetch from 'node-fetch';

import { Bot, Logger } from '../';

let lastCheck = new Date().getTime() - 300000;

let awsers = -1

interface awsersInterface {
	id: number;
	text: string;
	author: {
		pp: string;
		name: string;
	};
}

export const rss = async (client: Bot) => {
	Logger.info('RSS LOOP');

	const notificationChannel = client.channels.cache.get(client.inDev ? `887745625637142570` : `887719893825388557`) as TextChannel;
	
	const htmlForum = await fetch(`${process.env.MOODLE_LINK}/mod/forum/view.php?id=93`).then(res => res.text())
	
	const lastForum = htmlForum.split(`<tr class="discussion r`)[1]

	const lastForumLink = lastForum.split(`<a href="`)[1].split(`"`)[0]
	
	const htmlLast = await fetch(lastForumLink).then(res => res.text())

	const timeLastForum = htmlLast.split(`<div class="author" role="heading" aria-level="2">par <a href=`)[1].split(`</a>, `)[1].split(`</div>`)[0]

	const dateDay = Number(timeLastForum.split(` `)[1])
	const dateMounth = Number(timeLastForum.split(` `)[2]
		.replace('janvier', '0')
		.replace('févier', '1')
		.replace('mars', '2')
		.replace('avril', '3')
		.replace('mai', '4')
		.replace('juin', '5')
		.replace('juillet', '6')
		.replace('aout', '7')
		.replace('septembre', '8')
		.replace('octobre', '9')
		.replace('novembre', '10')
		.replace('décembre', '11')
	)
	const dateYear = Number(timeLastForum.split(` `)[3].replace(",", ""))

	const dateHour = Number(timeLastForum.split(` `)[4].split(`:`)[0])
	const dateMinute = Number(timeLastForum.split(` `)[4].split(`:`)[1])

	const dateLastForum = new Date(dateYear, dateMounth, dateDay, dateHour, dateMinute, 59, 59).getTime()

	
	// There is a new forum !
	if (dateLastForum > lastCheck) {

		// Code from lastForum command yes, it's not optimised but it work and that's the only thing I care
		const sujet = lastForum.split(`<td class="topic starter">`)[1].split('</td>')[0];
		const titre = sujet.split('>')[1].split('</')[0];
		const authorInfo = lastForum.split(`<td class="author">`)[1].split('</td>')[0];
		const authorName = authorInfo.split(`<div class="media-body">`)[1].split('</div>')[0].split('">')[1].split('</a>')[0];
		const authorPP = authorInfo.split(`<span class="pull-left">`)[1].split('</span>')[0].split(`<img src="`)[1].split(`"`)[0];

		const description =
			(await (await fetch(lastForumLink)).text())
				.split(`<div class="posting fullpost">`)[1]
				.split(`<div class="attachedimages">`)[0]
				.replace(/<p>/g, '')
				.replace(/<\/p>/g, '\n')
				.replace(/<br \/>/g, '\n')
				.replace(/<p align="left">/, '')
				.replace(/&gt;/g, '>')
				.replace(/<b>/g, "**")
				.replace(/<\/b>/g, "**") + `\n[Lien](${lastForumLink})\n<:Nothing:888076372981993512>`;

		const embed = new MessageEmbed({
			author: {
				name: `Un nouveau sujet a été créé sur le forum !`,
				url: lastForumLink,
			},
			title: titre,
			description,
			footer: {
				text: `Par ${authorName}`,
				iconURL: authorPP,
			},
			color: authorName === 'Yann Bertrand' || authorName === 'Jérôme Cantaloube' ? 'RED' : 'DARK_PURPLE',
		});

		notificationChannel.send({embeds: [embed]})
		awsers = 0
	}

	const awsersLast = Number(lastForum.split(`<td class="lastpost">`)[0].split(`<td class="replies"><a href="`)[1].split(`>`)[1].split("</a")[0])
	if (awsers = -1) awsers = awsersLast

	if (awsersLast > awsers) {
		const nbAwsers = awsersLast - awsers
		const sujet = lastForum.split(`<td class="topic starter">`)[1].split('</td>')[0];
		const titre = sujet.split('>')[1].split('</')[0];
		const awsersList = htmlLast.split(`<div class="indent">`).slice(1, nbAwsers + 1)

		const awsersTab: awsersInterface[] = []

		for (const awserInList of awsersList) {
			awsersTab.push({
				id: Number(awserInList.split('<a id="p')[1].split(`">`)[0]),
				text: awserInList
					.split(`<div class="posting fullpost">`)[1]
					.split(`<div class="attachedimages">`)[0]
					.replace(/<p>/g, '')
					.replace(/<\/p>/g, '\n')
					.replace(/<br \/>/g, '\n')
					.replace(/&gt;/g, '>')
					.replace(/<b>/g, "**")
					.replace(/<\/b>/g, "**"),
				author: {
					pp: awserInList.split(`<div class="left picture">`)[1].split('</div>')[0].split(`<img src="`)[1].split(`"`)[0],
					name: awserInList.split(`<div class="author"`)[1].split('</div>')[0].split('<a href="')[1].split('</a>')[0].split(`">`)[1],
				}
			})
		}
		awsersTab.sort((a, b) => b.id - a.id)

		let embedTab: MessageEmbed[] = []

		for (let i = 0; i < nbAwsers; i++) {
			embedTab.push(
				new MessageEmbed({
					author: {
						name: `Un nouveau message a été envoyé sur le forum !`,
						url: lastForumLink + `#p${awsersTab[i].id}`
					},
					title: `Re: ${titre}`,
					description: awsersTab[i].text + `\n[Lien](${lastForumLink + `#p${awsersTab[i].id}`})\n<:Nothing:888076372981993512>`,
					footer: {
						text: `Par ${awsersTab[i].author.name}`,
						iconURL: awsersTab[i].author.pp,
					},
					color: awsersTab[i].author.name === 'Yann Bertrand' || awsersTab[i].author.name === 'Jérôme Cantaloube' ? 'GREEN' : 'DARK_ORANGE',
				})
			)
		}

		embedTab.reverse()

		notificationChannel.send({embeds: embedTab})
	}

	lastCheck = new Date().getTime();
	//setTimeout(() => {
	//	rss(client);
	//}, 300000);
};
