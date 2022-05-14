const discord = require("discord.js");
const config = require("../data/config.json");
const server = require("../data/server.json");
const users = require("../data/config.json");
const color = config.color;
const footer = config.footer;

module.exports.run = async (client, message, args) => {

    var AlgemeneCommands = "`help`"
    var ticketCommands = "N.v.t."
    var staffCommands = "N.v.t."

    var embed = new discord.MessageEmbed()
        .setTitle("Commands")
        .setDescription("Prefix: `,`")
        .addField("Algemene Commands", AlgemeneCommands)
        .addField("Ticket Commands", ticketCommands)
        .addField("Staff Commands", staffCommands)
        .setColor(color)
        .setFooter(footer);

    return message.channel.send({embeds: [embed]});
}

module.exports.help = {
    name: "help",
    allias: "commands"
}