const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Shows wallets balance'),
		access: [],
	async execute(client, i, qiwi) {
		let wallets = await qiwi.getWallets();

		let embeds = [];
		for (const wal of wallets.accounts) {
			let embed = new MessageEmbed()
				.setColor('#FF8C00')
				.setTitle(`<:qiwi:1010262149903437885> ${wal.bankAlias} | ${wal.title}`)
				.setDescription(`${wal.balance.amount} ${qiwi.currencyCodes[wal.balance.currency]}`);

			embeds.push(embed);
		}

		i.reply({ embeds: embeds });
	},
};