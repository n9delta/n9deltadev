const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transactions')
		.setDescription('Shows the selected transactions')
		.addIntegerOption(o =>
			o.setName('amount')
				.setDescription('The number of transactions shown (Max 50)')
				.setRequired(true))
		.addStringOption(o =>
			o.setName('type')
				.setDescription('Type of transactions shown')
				.setRequired(false)
				.addChoices(
					{ name: 'ALL', value: 'ALL' },
					{ name: 'IN', value: 'IN' },
					{ name: 'OUT', value: 'OUT' },
				)),
	access: ['763105344754417726'],
	async execute(client, i, qiwi) {
		let transactions = await qiwi.getTransHistory({
			rows: i.options.getInteger('amount'),
			operation: i.options.getString('type') ?? 'ALL',
		});

		let embeds = [];
		for (const trans of transactions.data) {
			if (!trans.status == 'SUCCESS') continue;
			let embed = new MessageEmbed()
				.setColor(`${trans.type == 'IN' ? '#4BBD5C' : '#D0021B'}`)
				.setTitle(`${trans.type == 'IN' ? '<:PLUS:1003340677825953913> Поступление от' : '<:MINUS:1003340675653308466> Перевод на'} ${trans.account}`)
				.addFields(
					{ name: 'Сумма', value: `\`${trans.type == 'IN' ? '' : '-'}${trans.total.amount}\`` },
				)
				.setThumbnail(`${trans.provider.logoUrl ?? ''}`);

			if (trans.comment) embed.addFields( { name: 'Комент', value: `\`${trans.comment}\`` } );

			embeds.push(embed);
		};

		i.reply({ embeds: embeds });
	},
};