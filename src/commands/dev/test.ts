import {CommandInteraction} from 'discord.js';
import { errors, login } from 'pronote-api';
import {Command, Bot} from '../../utils/class';
import fetch from "node-fetch"

export default new Command(
	{
		name: 'test',
		description: 'test',
		defaultPermission: false,
	},
	async (client: Bot, interaction: CommandInteraction) => {
		await interaction.deferReply()

		let res = await fetch(process.env.MOODLE_LINK + "/course/view.php?id=16", {method: "GET", headers: {
			Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
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
		/*
		const main = async() => {
			const session = await login((process.env.PRONOTE_LINK as string), (process.env.PRONOTE_USER as string), (process.env.PRONOTE_MDP as string), "monbureaunumerique-educonnect")
			
			console.log(session.user?.name); // Affiche le nom de l'élève
			console.log(session.user?.studentClass.name); // Affiche la classe de l'élève
			
			const timetable = await session.timetable(); // Récupérer l'emploi du temps d'aujourd'hui
			const marks = await session.marks(); // Récupérer les notes du trimestre
			
			console.log(`L'élève a ${timetable?.length} cours aujourd'hui`); 
			console.log(`et a pour l'instant une moyenne de ${marks?.averages.student} ce trimestre.`);
			
			// etc. les fonctions utilisables sont 'timetable', 'marks', 'contents', 'evaluations', 'absences', 
			// 'homeworks', 'infos', et 'menu', sans oublier les champs 'user' et 'params' qui regorgent d'informations.
		}

		await main().catch(err => {
			if (err.code === errors.WRONG_CREDENTIALS.code) {
				console.error('Mauvais identifiants');
			} else {
				console.error(err);
			}
		});
		*/
		
		await interaction.editReply({content: `File was read`})
	},
	{
		user: {
			dev: true,
		},
	}
);
