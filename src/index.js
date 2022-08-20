require('dotenv').config()
const fs = require('node:fs');
const path = require('node:path');

const { Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });

const { Op } = require('sequelize');
const { Users } = require('./db/dbObjects.js');

const { Qiwi } = require('./qiwiApi.js')
const qiwi = new Qiwi(process.env.APIKEY, process.env.PHONE);

// Считывание всех файлов комманд и добавление в коллецию
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// Обработчик неизвестных ошибок
process.on("uncaughtException", (e) => {
    console.error(e);
});

client.once('ready', async () => {
	console.log('Ready!');
});

/*
* Обработчик взаимодействий
*/ 
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	if (!(command.access?.includes(interaction.user.id) || process.env.ADMINS.split(',').includes(interaction.user.id))) {
		let embed = new MessageEmbed()
			.setColor('#D0021B')
			.setDescription('У вас нет прав на выполнение этой команды');

		return interaction.reply({ embeds: [embed], ephemeral: true });
	}

	try {
		await command.execute(client, interaction, qiwi, Users);
	} catch (error) {
		console.error(error);
		
		let embed = new MessageEmbed()
			.setColor('#D0021B')
			.setDescription('Неизвестная ошибка при выполнение этой команды! Свяжитесь с администратором');

		await interaction.reply({ embeds: [embed], ephemeral: true });
	}
});

/*
* Обработчик сообщений
*/ 
client.on('messageCreate', async (msg) => {
	// Проверка начинает ли с префикса сообщение

	/*
	* [DEPRECATED]
	* Использование команд в таком формате устарело
	* Рекомендуется использовать слеш команды
	*/
	const prefix = 'e9';
	if (!msg.content.startsWith(prefix)) return;

	const args = msg.content.trim().split(/ +/g);
	const cmd = args[0].slice(prefix.length).toLowerCase();

	if (cmd === 'ping') {
		msg.channel.send('pong');
	} 
});

// Залогиниться с токеном
client.login(process.env.TOKEN);