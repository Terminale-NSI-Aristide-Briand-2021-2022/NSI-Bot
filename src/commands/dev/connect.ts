import {CommandInteraction, MessageEmbed} from 'discord.js';
import { errors, login } from 'pronote-api';
import {Command, Bot} from '../../utils/class';

export default new Command(
	{
		name: 'connect',
		description: 'try a connection with the given ids',
        options: [
            {
                type: "STRING",
                name: "username",
                description: "username",
                required: true
            },
            {
                type: "STRING",
                name: "mdp",
                description: "mdp",
                required: true
            },
            {
                type: "STRING",
                name: "cas",
                description: "cas",
                required: false
            },
            {
                type: "STRING",
                name: "url",
                description: "url",
                required: false
            }
        ],
		defaultPermission: false,
	},
	async (client: Bot, interaction: CommandInteraction) => {
		await interaction.deferReply()

        const username = interaction.options.getString("username", true)
        const mdp = interaction.options.getString("mdp", true)
        const cas = interaction.options.getString("cas", false)
        const url = interaction.options.getString("url", false)
		
		const main = async() => {
			const session = await login(url ?? (process.env.PRONOTE_LINK as string), username, mdp, cas ?? undefined)
            session.logout()
		}
        let error = false
		await main().catch(async err => {
            error = true
			if (err.code === errors.WRONG_CREDENTIALS.code) {
				await interaction.editReply({content: `Wrong credentials`})
			} else {
                await interaction.editReply({content: `Error`})
                const embed = new MessageEmbed({
                    color: 'RED',
                    author: {
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL(),
                    },
                    footer: {
                        text: client?.user?.username + ' • Page (' + Math.floor(0 / 1800) + '/' + (Math.ceil(err.length / 1800) - 1) + ') ',
                        iconURL: client?.user?.displayAvatarURL(),
                    },
                    description: '```js\n' + err + '```',
                });
                await interaction.followUp({embeds: [embed], ephemeral: true})
			}
		});
        if (!error) await interaction.editReply({content: `It work !!!`})
	},
	{
		user: {
			dev: true,
		},
	}
);
