import { CommandInteraction, MessageEmbed } from 'discord.js';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { Bot, Command } from '../../utils';

export default new Command(
	{
		name: 'test',
		description: 'test',
		defaultPermission: false,
	},
	async (client: Bot, interaction: CommandInteraction) => {
		//await interaction.reply({content: "loading..."});
		// get a connection token
		let result = await fetch(process.env.MOODLE_LINK + '/login/index.php')
		let y = result.headers.get('set-cookie')?.replace('MoodleSession=', '').split(';')[0] || "";
		console.log(result.headers)
		const dom = new JSDOM(await result.text());
		let t = dom.window.document.getElementById('guestlogin')?.innerHTML.split('<input type="hidden" name="logintoken" value="')[1].split('">')[0] ?? '';
		console.log(t);

		// get a MoodleSession Token
		const params = new URLSearchParams();
		params.append('logintoken', t);
		params.append('username', 'guest');
		params.append('password', 'guest');
		let result1 = (
			await fetch(process.env.MOODLE_LINK + '/login/index.php', {
				body: params,
				method: 'POST',
				headers: {
					Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
					Cookie: 'MoodleSession=' + y,
					Connection: 'keep-alive',
				},
			})
		).headers.get('set-cookie');

		console.log(result1);
		let test = result1?.replace('MoodleSession=', '').split(';')[0];
		console.log(test);

		// ?? Test the connection I guess 🤷‍♂️
		let result2 = (
			await fetch(process.env.MOODLE_LINK + '/login/index.php?testsession=1', {
				method: 'GET',
				headers: {
					Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
					Cookie: 'MoodleSession=' + test,
					Connection: 'keep-alive',
				},
			})
		).status;
		console.log(result2); // why the hell is this sending me a 200 and on my browser it send a 303

		console.log(
			await (
				await fetch(process.env.MOODLE_LINK + '/course/view.php?id=16', {
					method: 'GET',
					headers: {
						Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
						Cookie: 'MoodleSession=' + test,
						Connection: 'keep-alive',
					},
				})
			).text()
		);
		let Tabs = (
			await (
				await fetch(process.env.MOODLE_LINK + '/course/view.php?id=16', {
					method: 'GET',
					headers: {
						Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
						Cookie: 'MoodleSession=' + test,
						Connection: 'keep-alive',
					},
				})
			).text()
		)
			.split(`<ul class="section img-text">`)[1]
			.split('</ul>')[0]
			.split(`<li class="activity resource modtype_resource " id="module-`);

		let tabNeeded = Tabs[Tabs.length - 1].split(`">`)[0];
		let tabName = Tabs[Tabs.length - 1].split(`<span class="instancename">`)[1].split('<span')[0];
		let embed = new MessageEmbed({
			title: 'Le dernier tableau disponible !',
			description: `${tabName} disponible au lien suivant : [Lien](${process.env.MOODLE_LINK + '/mod/resource/view.php?id=' + tabNeeded})`,
			color: 'LUMINOUS_VIVID_PINK',
		});
		interaction.reply({embeds: [embed]}); /*
		/*fGbssRuNMOYTl5vYSDscLGX6WNA17sYH
		let res = await fetch("http://pronote.lyc-briand-44.ac-nantes.fr/pronote/eleve.html?identifiant=rgmeR3FYDpQCzxcA", {method: "GET", headers: {
			Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,;q=0.8,application/signed-exchange;v=b3;q=0.9",
			Cookie: "MoodleSession="+process.env.MOODLE_SESSION,
			Connection: "keep-alive"
		}})
		let resTrans = await res.text()
		console.log(resTrans)

		/*
		let res = await fetch(process.env.MOODLE_LINK + "/mod/forum/view.php?id=93")
		let last = (await res.text()).split("<tr class=\"discussion r")[1]
		console.log(last)
		let tab = last.split(">")
		let dateStr = tab[27]
		let dateTab = dateStr.split(" ")
        let hourTab = dateTab[4].split(":")
        let mounth = dateTab[2].replace("janv.", "0").replace("fébr.", "1").replace("mars", "2").replace("avril","3").replace("mai","4").replace("juin","5").replace("juil.","6").replace("aout","7").replace("sept.","8").replace("oct.","9").replace("nov.","10").replace('déc',"11")
        const dateRss = (new Date(Number(dateTab[3].replace(",", "")), Number(mounth), Number(dateTab[1]), Number(hourTab[0]), Number(hourTab[1].replace("</a", "")))).getTime() + 999
        console.log(dateRss)
		
		const main = async () => {
			const session = await login(
				process.env.PRONOTE_LINK as string,
				process.env.PRONOTE_USER as string,
				process.env.PRONOTE_MDP as string,
				'monbureaunumerique-educonnect'
			);

			console.log(session.user?.name); // Affiche le nom de l'élève
			console.log(session.user?.studentClass.name); // Affiche la classe de l'élève

			const timetable = await session.timetable(); // Récupérer l'emploi du temps d'aujourd'hui
			const marks = await session.marks(); // Récupérer les notes du trimestre

			console.log(`L'élève a ${timetable?.length} cours aujourd'hui`);
			console.log(`et a pour l'instant une moyenne de ${marks?.averages.student} ce trimestre.`);

			// etc. les fonctions utilisables sont 'timetable', 'marks', 'contents', 'evaluations', 'absences',
			// 'homeworks', 'infos', et 'menu', sans oublier les champs 'user' et 'params' qui regorgent d'informations.
		};

		await main().catch(err => {
			if (err.code === errors.WRONG_CREDENTIALS.code) {
				console.error('Mauvais identifiants');
			} else {
				console.error(err);
			}
		});
		*/
		//await interaction.editReply({content: `File was read`});
	},
	{
		user: {
			dev: true,
		},
	}
);
