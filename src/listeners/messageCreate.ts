import {Client, Message} from "discord.js"
import * as fs from "fs"
import {timeChannelId} from "../Bot";
import {CANT_CLEAR_TIME_SHEET, WRONG_TIME_MESSAGE_FORMAT} from "../errors";

const cmdPrefix = "!f2cm"

export default (client: Client): void => {
    client.on('messageCreate', (msg) => {
        if (msg.content.startsWith(cmdPrefix) && !msg.author.bot) {
            const args = msg.content.slice(cmdPrefix.length).trim().split(' ')
            const cmd = args[0]
            switch (cmd) {
                case "downloadTime": {
                    downloadTime(client, msg)
                    break
                }
                case "dt": {
                    downloadTime(client, msg)
                    break
                }
                case "clearTime": {
                    clearTimeSheet(msg)
                    break;
                }
                case "time": {
                    const content = args.slice(1, args.length).join(" ")
                    try {addTimeRecord(content, msg.author.username)}
                    catch (e) {msg.channel.send(WRONG_TIME_MESSAGE_FORMAT)}
                    break
                }
                case "help": {
                    sendHelpMessage(msg)
                    break
                }
            }
        }
        else if(msg.channelId === timeChannelId && !msg.author.bot) {
           try{addTimeRecord(msg.content, msg.author.username)}
           catch (e) {msg.channel.send(WRONG_TIME_MESSAGE_FORMAT)}
        }

    })


}
const clearTimeSheet = (msg: Message) => {
    fs.writeFile("data/time.csv", "", err => {if(err) msg.channel.send(CANT_CLEAR_TIME_SHEET)})
    msg.channel.send("Sucessfully cleared time sheet")
}

const downloadTime = (client: Client, msg: Message) => {
    console.log("received request to download time csv")
    msg.channel.send({files: [{attachment: "./data/time.csv", name: "TimeSheet.csv"}]})
        .then(console.log)
        .catch(console.error)
}
const addTimeRecord = (msg: string, personName: string) => {
    const csv = parseMessageToCSVLine(msg, personName)
    console.log(`adding message ${msg} to timesheet`)
    fs.appendFile("data/time.csv", csv, err => {if(err) throw err})
}
const parseMessageToCSVLine = (msg: string, personName: string): string => {
    let csv = ""
    const line = msg.split(" - ")
    if(line.length !== 3)
        throw new Error("Message doesnt fit the time format")
    line.push(personName)
    csv += line.join(";") + "\n"
    return csv
}
const sendHelpMessage = (msg: Message) => {
    msg.channel.send(
        "!f2cm downloadTime or dt - download time csv data" + "\n" +
        "!f2cm time - add a time record with the format: Time - Category - Description"
    )
}