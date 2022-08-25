const { MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent } = require('discord.js');

function successEmbed(text) {
	return new MessageEmbed()
		.setColor('#4BBD5C')
		.setDescription(`🟢 **${text}**`)
};

function errorEmbed(text) {
	return new MessageEmbed()
		.setColor('#D0021B')
		.setDescription(`🔴 **${text}**`);
}

function emptyButton() {
	return new MessageButton()
		.setCustomId(String(Math.random()))
		.setLabel('  ')
		.setStyle('SECONDARY');
}

function backButton(id) {
	return new MessageButton()
		.setCustomId(id)
		.setLabel('Back')
		.setStyle('SECONDARY')
		.setEmoji('📎');
}

module.exports = { successEmbed, errorEmbed, emptyButton, backButton };