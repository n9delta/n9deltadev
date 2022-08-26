const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Executes a javascript')
		.addStringOption(o =>
			o.setName('code')
				.setDescription('The code to execute')
				.setRequired(true))
		.addBooleanOption(o =>
			o.setName('ephemeral')
				.setDescription('Whether to use ephemeral in the message')
				.setRequired(false)),
	access: [],
	async execute(client, i) {
		let result;

		try {
			result = eval(i.options.getString('code'));
		} catch (err) {
			result = err;
		}

		i.reply({ content: `\`\`\`js\n${result}\`\`\``, ephemeral: i.options.getBoolean('ephemeral')});
	},
};