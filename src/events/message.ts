import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from 'discord.js';
import piston from 'node-piston';

import { Bot, Event } from '../utils';

const pistonClient = piston();

export default new Event('messageCreate', async (client: Bot, message: Message) => {
	if (!message.guild || message.author.bot) return;
	if (!message.content?.includes('```')) return;
	let code = message.content.split('```')[1];
	if (code.startsWith('py')) code = code.replace('py\n', '');

	const msg = await message.reply({
		content: `Voulez vous que j'éxecute le code contenu dans ce message ?`,
		allowedMentions: {
			repliedUser: false,
		},
		components: [
			new MessageActionRow({
				components: [
					new MessageButton({
						customId: `yes`,
						emoji: '888076372981993512',
						style: 'SUCCESS',
					}),
					new MessageButton({
						customId: `no`,
						emoji: '888076372981993512',
						style: 'DANGER',
					}),
				],
			}),
		],
	});
	const col = msg.createMessageComponentCollector({
		componentType: 'BUTTON',
		time: 60000,
	});
	col.on('collect', async (i: MessageComponentInteraction) => {
		if (i.customId === 'no') {
			i.deferUpdate();
			setTimeout(() => {
				msg.delete();
			}, 2000);
		} else {
			i.deferUpdate();

			const result = await pistonClient.execute('python', code);

			let output = result.run.stdout.length ? result.run.stdout : 'Aucune sortie';
			if (result.run.stderr.length) output = result.run.stderr;

			const embed = new MessageEmbed({
				title: `Code Python <:python:889118759049121883>`,
				description: `Code :\`\`\`py\n${code}\`\`\`Sortie :\`\`\`py\n${output}\`\`\``,
				color: 'YELLOW',
				footer: {
					text: i.user.username,
					iconURL: i.user.avatarURL() ?? '',
				},
			});
			msg.edit({
				embeds: [embed],
				allowedMentions: {
					repliedUser: false,
				},
				content: null,
				components: [],
			});
		}
		col.stop();
	});
	col.on('end', async (c, r) => {
		if (r === 'time') {
			msg.delete();
		}
	});
});
