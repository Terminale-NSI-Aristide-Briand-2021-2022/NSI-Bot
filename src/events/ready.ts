import { PresenceData, TextChannel } from 'discord.js';
import {Command, Event, Bot, Logger} from '../utils/class/index';
import { rss } from '../utils/functions/rss';

export default new Event('ready', async (client: Bot) => {
	const guilds = [
		client.guilds.cache.get(`887719893825388554`) //This is my testing guild
	];
	Logger.log(`${client.user?.username} launched in ${Date.now() - client.launchedAt}ms !`);

	Logger.info('Commands', 'SETUP');
	client.user?.setPresence({
		status: 'dnd',
		activities: [
			{
				name: 'Loading...',
				type: 'PLAYING',
			},
		],
	});

	if (client.inDev) {
		for (const guild of guilds) {
			await guild?.commands.set(client.commands.filter(c => c instanceof Command).map(c => (c as Command).data)).catch(_ => _);
			for (const cmd of client.commands.filter(c => c instanceof Command && (c.permission?.user?.dev ?? false)).map(m => (m as Command).data.name)) {
				guild?.commands.cache
					.find(c => c.name === cmd)
					?.permissions.add({
						permissions: [
							{
								id: '563749920683720709', //Fantomitechno
								type: 'USER',
								permission: true,
							},
						],
					}).catch(_ => _);
			}
			for (const cmd of client.commands.filter(c => c instanceof Command && (c.permission?.user?.mod ?? false)).map(m => (m as Command).data.name)) {
				guild?.commands.cache
					.find(c => c.name === cmd)
					?.permissions.add({
						permissions: [
							{
								type: "USER",
								id: "563749920683720709", //Fantomitechno
								permission: true
							}
						],
					}).catch(_ => _);
			}
		}
	}
	Logger.info('Cache', 'SETUP');
	for (const guild of client.guilds.cache.map(m =>m)) {
        await guild?.members.fetch()
	}
	Logger.info('Done', 'SETUP');
    client.user?.setPresence({
		status: "online",
		activities: [
			{
				name: "les devoirs à faire",
				type: 'WATCHING'
			}
		]
	})
    setInterval(() => {
        client.user?.setPresence({
			status: "online",
			activities: [
				{
					name: "les devoirs à faire",
					type: 'WATCHING'
				}
			]
		})
    },
    60000)

	await rss(client)
});