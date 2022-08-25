const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { Colors } = require('./../helpers/consoleColors.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads the bot'),
	access: [],
	async execute(client, i) {
		await i.reply({ content: '🔄 **Перезагрузка бота...**', ephemeral: true });
		console.log(Colors.FgBlue + `DEV | Ручная перезагрузка бота от ${i.user.username} (${i.user.id})` + Colors.Reset);
		process.exit(0);
	},
};