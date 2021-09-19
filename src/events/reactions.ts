import {MessageEmbed, MessageReaction, User} from 'discord.js';
import {Event, Bot} from '../utils/class/index';
import piston from 'node-piston';

export default new Event('messageReactionAdd', async (client: Bot, reaction: MessageReaction, user: User) => {
	if (!reaction.message.guild || user.bot || reaction.emoji.id != '889118759049121883') return;
	if (!reaction.message.content?.includes('```')) return;
	let code = reaction.message.content.split('```')[1];
	if (code.startsWith('py')) code = code.replace('py\n', '');
	const pistonClient = piston();

	const result = await pistonClient.execute('python', code);

	let output = result.run.stdout ?? 'Aucune sortie';
	if (result.run.stderr.length) output = result.run.stdout;

	const embed = new MessageEmbed({
		title: `Code Python`,
		description: `Code :\`\`\`py\n${code}\`\`\`Sortie :\`\`\`py\n${output}\`\`\``,
	});
	reaction.message.reply({
		embeds: [embed],
		allowedMentions: {
			repliedUser: false,
		},
	});
});
