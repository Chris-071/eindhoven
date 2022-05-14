const { Client, Intents, DiscordAPIError, Message, Collection, MessageEmbed } = require("discord.js");
const config = require("./data/config.json");
const server = require("./data/server.json");
const users = require("./data/users.json");
const discord = require("discord.js");
const fs = require("fs");
const moment = require("moment");
const discordModals = require('discord-modals');
const { Modal, TextInputComponent, showModal } = require('discord-modals')
const color = config.color;
const footer = config.footer;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES] });

discordModals(client);
client.commands = new Collection();

const activiteiten = [
    `⭐ SOON`,
    `📌 Eindhoven`
];

const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    client.commands.set(command.help.name, command);
    client.commands.set(command.help.allias, command);

    console.log(`✅ Command: ${command.help.name}.js is succesvol geladen!`);

}

client.once("ready", async () => {

    console.log(`🔰 Alle files zijn geladen!`);
    console.log(`🔰 De bot is succesvol opgestart!`);

    var i = 0;
    setInterval(() => client.user.setActivity(`${activiteiten[i++ % activiteiten.length]}`, { type: 'WATCHING' }), 10000);

    var suggestieEmbed = new discord.MessageEmbed()
        .setTitle("Suggestie")
        .setDescription("> Klik op de onderstaande knop om een suggestie te versturen.")
        .setColor(color)
        .setFooter(footer);

    const suggestieButtons = new discord.MessageActionRow().addComponents(
        new discord.MessageButton()
            .setCustomId('suggestie-button')
            .setLabel('Suggestie')
            .setEmoji('📌')
            .setStyle('PRIMARY')
    );


    const guild = client.guilds.cache.get('971437260627116112');
    const kanaal = guild.channels.cache.get(server.kanalen.server);
    // kanaal.send({ embeds: [suggestieEmbed], components: [suggestieButtons] });

});

client.on("guildMemberAdd", member => {

    const guild = client.guilds.cache.get('971437260627116112');
    const kanaal = guild.channels.cache.get(server.kanalen.algemeen);
    const lidRol = guild.roles.cache.get(server.rollen.member);

    member.roles.add(lidRol);

    var joinEmbed = new discord.MessageEmbed()
        .setDescription(`🔔| <@${member.user.id}> is de server gejoind!`)
        .setColor(color)
        .setFooter(footer + ` - ${member.guild.memberCount.toString()} leden.`);

    kanaal.send({ embeds: [joinEmbed] });

});

client.on("messageCreate", async message => {

    if (message.author.bot) return;

    var prefix = config.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    if (!message.content.startsWith(config.prefix)) {

    } else {
        const commandData = client.commands.get(command.slice(prefix.length));

        if (!commandData) return;

        var arguments = messageArray.slice(1);

        try {
            commandData.run(client, message, arguments);
        } catch (error) {
            console.log(`❌ Er is een error!`);
            console.log(error);
            message.reply("Error.")
        }
    }



});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'suggestie-button') {
            const suggestieModal = new Modal()
                .setCustomId('suggestie-modal')
                .setTitle(`Hallo ${interaction.member.user.username},`)
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('suggestie-modalTextInput')
                        .setLabel('Suggestie')
                        .setStyle('LONG')
                        .setMinLength(4)
                        .setMaxLength(2000)
                        .setPlaceholder('Typ hier jouw suggestie(s)..')
                        .setRequired(true)
                );

            showModal(suggestieModal, { client: client, interaction: interaction });
        }
    }
});

client.on("modalSubmit", (modal) => {
    if (modal.customId === 'suggestie-modal') {
        const suggestieAntwoord = modal.getTextInputValue('suggestie-modalTextInput');

        var suggestieEmbed2 = new discord.MessageEmbed()
            .setTitle("Nieuwe Suggestie")
            .setDescription(`${suggestieAntwoord}`)
            .setColor(color)
            .setFooter(footer + modal.user.username);
            
        const guild = client.guilds.cache.get('971437260627116112');
        const kanaal = guild.channels.cache.get(server.kanalen.suggesties);
        kanaal.send({ embeds: [suggestieEmbed2] })
    }
})

client.login(process.env.token);