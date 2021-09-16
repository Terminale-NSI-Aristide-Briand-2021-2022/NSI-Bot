import { Bot } from "../class";
import fetch from "node-fetch"
import { MessageEmbed, TextChannel } from "discord.js";

let lastCheck = new Date().getTime() - 300000

let awsers = [-1, -1, -1]

let checked = new Date().getDate() - 1

interface awsers {
    id: number,
    text: string,
    author: {
        pp: string,
        name: string
    }
}

export const rss = async (client: Bot) => {
    const notificationChannel = (client.channels.cache.get(`887745625637142570`/*`887719893825388557`*/) as TextChannel)

    let tab = (await (await fetch(process.env.MOODLE_LINK + "/mod/forum/view.php?id=93")).text()).split("<tr class=\"discussion r")

    let last = tab[1]

    // We get the date and we handle it to change it as a timestamp
	let dateStr = last.split(">")[27]
	let dateTab = dateStr.split(" ")
    let hourTab = dateTab[4].split(":")
    let mounth = dateTab[2].replace("janv.", "0").replace("fébr.", "1").replace("mars", "2").replace("avril","3").replace("mai","4").replace("juin","5").replace("juil.","6").replace("aout","7").replace("sept.","8").replace("oct.","9").replace("nov.","10").replace('déc',"11")
    const dateRss = (new Date(Number(dateTab[3].replace(",", "")), Number(mounth), Number(dateTab[1]), Number(hourTab[0])-2, Number(hourTab[1].replace("</a", "")))).getTime() + 9999

    let awserLast = Number(last.split(`<td class="replies">`)[1].split("</a>")[0].split(">")[1])

    if (awsers[0] === -1) awsers[0] = awserLast

    if (dateRss > lastCheck) {
        // Here we see that the last forum topic is new so we handle it
        const sujet = last.split(`<td class="topic starter">`)[1].split("</td>")[0]
        const url = sujet.split(`<a href="`)[1].split(`">`)[0]
        const titre = sujet.split(">")[1].split("</")[0]
        const authorInfo = last.split(`<td class="author">`)[1].split("</td>")[0]
        const authorName = authorInfo.split(`<div class="media-body">`)[1].split("</div>")[0].split("\">")[1].split("</a>")[0]
        const authorPP = authorInfo.split(`<span class="pull-left">`)[1].split("</span>")[0].split(`<img src="`)[1].split(`"`)[0]

        const description = (await (await fetch(url)).text()).split(`<div class="posting fullpost">`)[1].split(`<div class="attachedimages">`)[0].replace(/<p>/g, "").replace(/<\/p>/g, "\n").replace(/<br \/>/g, "\n") + `\n[Lien](${url})\n<:Nothing:888076372981993512>`

        const embed = new MessageEmbed({
            author: {
                name: `Un nouveau sujet a été crée sur le forum !`,
                url: url
            },
            title: titre,
            description,
            footer: {
                text: `Par ${authorName}`,
                iconURL: authorPP
            },
            color: authorName === "Yann  Bertrand" || authorName === "Jérôme Cantaloube" ? "RED" : "DARK_PURPLE"
        })
        notificationChannel.send({content: `<@&887935241405235260>`, embeds: [embed]})
    } if (awsers[0] < awserLast) {
        replies(last, notificationChannel, awserLast, 0)
    }

    let two = tab[2]

    let awserTwo = Number(two.split(`<td class="replies">`)[1].split("</a>")[0].split(">")[1])

    if (awsers[1] === -1) awsers[1] = awserTwo

    if (awsers[1] < awserTwo) {
        replies(two, notificationChannel, awserTwo, 1)
    }

    let three = tab[3]

    let awserThree = Number(three.split(`<td class="replies">`)[1].split("</a>")[0].split(">")[1])

    if (awsers[2] === -1) awsers[2] = awserThree

    if (awsers[2] < awserThree) {
        replies(three, notificationChannel, awserThree, 2)
    }

    let Tabs = (await (await fetch(process.env.MOODLE_LINK + "/course/view.php?id=16", {method: "GET", headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        Cookie: "MoodleSession=4mfh4jauhi15is6rrrem0ga8d0",
        Connection: "keep-alive"
    }})).text()).split(`<ul class="section img-text">`)[1].split("</ul>")[0].split(`<li class="activity resource modtype_resource " id="module-`)

    let tabNeeded = Tabs.find(i => i.includes(`di ${new Date().getDate()}/${(new Date().getMonth() + 1).toString().length === 2 ? (new Date().getMonth() + 1).toString() : "0" + (new Date().getMonth() + 1).toString()}`))?.split(`">`)[0]
    if (tabNeeded && checked != new Date().getDate()) {
        checked = new Date().getDate()
        let tabName = Tabs.find(i => i.includes(`di ${new Date().getDate()}/${(new Date().getMonth() + 1).toString().length === 2 ? (new Date().getMonth() + 1).toString() : "0" + (new Date().getMonth() + 1).toString()}`))?.split(`<span class="instancename">`)[1].split("<span")[0]
        let embed = new MessageEmbed({
            title: "Un nouveau tableau est disponible !",
            description: `${tabName} disponible au lien suivant : [Lien](${process.env.MOODLE_LINK + "/mod/resource/view.php?id=" + tabNeeded})`,
            color: "LUMINOUS_VIVID_PINK"
        })
        notificationChannel.send({embeds: [embed], content: "Nouveau tableau"})
    }

    lastCheck = new Date().getTime()
    setTimeout(rss, 300000)
}

async function replies(grosString:string, c: TextChannel, nbGS: number, index: number) {
    const awsersNb = nbGS - awsers[index]
    const sujet = grosString.split(`<td class="topic starter">`)[1].split("</td>")[0]
    const url = sujet.split(`<a href="`)[1].split(`">`)[0]
    const titre = sujet.split(">")[1].split("</")[0]
    const awsersList = (await (await fetch(url)).text()).split(`<div class="indent">`).slice(1, nbGS+1)
    let awsersTab: awsers[] = []
    for (let i = 0; i < awsersList.length; i++) {
        awsersTab.push({
            id: Number(awsersList[i].split("<a id=\"p")[1].split(`">`)[0]),
            text: awsersList[i].split(`<div class="posting fullpost">`)[1].split(`<div class="attachedimages">`)[0].replace(/<p>/g, "").replace(/<span>/g, "").replace(/<\/span>/g, "").replace(/<\/p>/g, "\n").replace(/<br \/>/g, "\n"),
            author: {
                pp: awsersList[i].split(`<div class="left picture">`)[1].split("</div>")[0].split(`<img src="`)[1].split(`"`)[0],
                name: awsersList[i].split(`<div class="author"`)[1].split("</div>")[0].split("<a href=\"")[1].split("</a>")[0].split(`">`)[1]
            }
        })
    }
    awsersTab.sort((a, b) => b.id - a.id)
    
    let embedTab: MessageEmbed[] = []
    for (let i = 0; i < awsersNb; i++) {
        embedTab.push(new MessageEmbed({
            author: {
                name: `Un nouveau message a été envoyé sur le forum !`,
                url: url + `#p${awsersTab[i].id}`
            },
            title: `Re: ${titre}`,
            description: awsersTab[i].text + `\n[Lien](${url + `#p${awsersTab[i].id}`})\n<:Nothing:888076372981993512>`,
            footer: {
                text: `Par ${awsersTab[i].author.name}`,
                iconURL: awsersTab[i].author.pp
            },
            color: awsersTab[i].author.name === "Yann Bertrand" || awsersTab[i].author.name === "Jérôme Cantaloube" ? "GREEN" : "DARK_ORANGE"
        }))
    }
    embedTab.reverse()
    c.send({content: `<@&887935415129112607>`, embeds: embedTab})

    awsers[index] = nbGS
}