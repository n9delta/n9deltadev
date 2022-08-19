const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Shows wallets balance'),
	async execute(client, i, qiwi) {
		let balances = await qiwi.getTransHistory();

		console.log(balances);
		i.reply('sux');
	},
};