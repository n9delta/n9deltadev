const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Shows the user profile'),
	async execute(client, i, qiwi, Users) {
		i.reply('test');
	},
};