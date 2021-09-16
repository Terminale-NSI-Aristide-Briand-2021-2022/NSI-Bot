import {CommandInteraction, MessageEmbed} from 'discord.js';
import {Command, Bot} from '../../utils/class';
import fetch from "node-fetch"

export default new Command(
	{
		name: 'last-tab',
		description: 'Get the last tab',
	},
	async (client: Bot, interaction: CommandInteraction) => {
		let Tabs = (await (await fetch(process.env.MOODLE_LINK + "/course/view.php?id=16", {method: "GET", headers: {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            Cookie: "MoodleSession=4mfh4jauhi15is6rrrem0ga8d0",
            Connection: "keep-alive"
        }})).text()).split(`<ul class="section img-text">`)[1].split("</ul>")[0].split(`<li class="activity resource modtype_resource " id="module-`)
    
        let tabNeeded = Tabs[0].split(`">`)[0]
        let tabName = Tabs.find(i => i.includes(`di ${new Date().getDate()}/`))?.split(`<span class="instancename">`)[1].split("<span")[0]
        let embed = new MessageEmbed({
            title: "Le dernier tableau disponible !",
            description: `${tabName} disponible au lien suivant : [Lien](${process.env.MOODLE_LINK + "/mod/resource/view.php?id=" + tabNeeded})`,
            color: "LUMINOUS_VIVID_PINK"
        })
        interaction.reply({embeds: [embed]})
        
	}
);
