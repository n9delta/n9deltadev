const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent } = require('discord.js');
const { successEmbed, errorEmbed, emptyButton, backButton } = require('./../helpers/messageBuilders.js');

const { Op } = require('sequelize');

const IdRegex = /(?<=_)[0-9a-zA-Z]*((?=_))?/gm;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('category')
		.setDescription('Calls the menu for category management'),
	access: [],
	async execute(client, i, qiwi, Users, Categories, Products) {
		let categories = await Categories.findAll();

		const homeEmbed = new MessageEmbed()
			.setColor('#FF8C00')
			.setDescription(`📦 **Управление категориями**`);

		const homeRow = new MessageActionRow()
			.addComponents(
				
				new MessageButton()
					.setCustomId('create')
					.setLabel('Create')
					.setStyle('SECONDARY')
					.setEmoji('🖌️'),
				
				emptyButton(),

				new MessageButton()
					.setCustomId('edit')
					.setLabel('Edit')
					.setStyle('SECONDARY')
					.setEmoji('🔧'),

			);

		const filter = b => b.user.id == i.user.id;
		const collector = i.channel.createMessageComponentCollector({ filter, time: 180000 });
		
		await i.reply({ embeds: [homeEmbed], components: [homeRow], ephemeral: true });

		collector.on('collect', async b => {
			if (b.customId == 'create') {
				const categoryCreate = new Modal()
					.setCustomId('categoryCreate')
					.setTitle('Создание категории')
					.addComponents(
						new MessageActionRow()
							.addComponents(
								new TextInputComponent()
									.setCustomId('name')
									.setLabel('Название')
									.setMaxLength(32)
									.setMinLength(2)
									.setPlaceholder('Пример названия')
									.setRequired(true)
									.setStyle('SHORT'),
							),
					);

				await b.showModal(categoryCreate);

				const modalFilter = b => b.user.id == i.user.id && b.customId == 'categoryCreate';
				const categoryCreateSubmit = await b.awaitModalSubmit({ filter: modalFilter, time: 60000 });
				
				if (categoryCreateSubmit) {
					const fields = {
						name: categoryCreateSubmit.fields.getTextInputValue('name'),
					};

					let category = await Categories.findOne({ where: { name: { [Op.like]: fields.name } } });

					let embed;
					const row = new MessageActionRow()
						.addComponents(
							emptyButton(),
							emptyButton(),
							backButton('home'),
						);

					if (category) {
						embed = errorEmbed('Извините, но категория с таким именем уже существует');
					} else {
						category = await Categories.create({ name: fields.name });
						categories = await Categories.findAll();

						embed = successEmbed(`Создана категория: \`${category.name}\``);
					}

					await categoryCreateSubmit.deferUpdate(); return await categoryCreateSubmit.editReply({ embeds: [embed], components: [row] });
				}
			}

			if (b.customId == 'edit') {
				let row = [];

				row.push(new MessageActionRow()
					.addComponents(
						emptyButton(),
						emptyButton(),
						backButton('home'),
					)
				);

				for (let [i, cat] of categories.entries()) {
					if (i % 3 == 0) {
						row.push(new MessageActionRow());
					}

					row[Math.floor(i/3+1)].addComponents(
						new MessageButton()
							.setCustomId(`catselect_${cat.id}`)
							.setLabel(`${cat.name}`)
							.setStyle('SECONDARY'),
					);
				}

				await b.deferUpdate(); return await b.editReply({ embeds: [homeEmbed], components: row });
			}

			if (b.customId.startsWith('catselect')) {
				const categoryId = (b.customId.match(IdRegex))[0];

				let row = [];

				row.push(new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId(`catcreate_${categoryId}`)
							.setLabel('Create')
							.setStyle('SECONDARY')
							.setEmoji('🔑'),
						new MessageButton()
							.setCustomId(`catrename_${categoryId}`)
							.setLabel('Rename')
							.setStyle('SECONDARY')
							.setEmoji('🎟️'),
						new MessageButton()
							.setCustomId(`catdelete_${categoryId}`)
							.setLabel('Delete')
							.setStyle('SECONDARY')
							.setEmoji('🔨'),
						backButton('edit'),
					)
				);

				const products = await Products.findAll({ where: { categoryId: categoryId } });

				for (let [i, pro] of products.entries()) {
					if (i % 3 == 0) {
						row.push(new MessageActionRow());
					}

					row[Math.floor(i/3+1)].addComponents(
						new MessageButton()
							.setCustomId(`proselect_${pro.id}`)
							.setLabel(`${pro.cost}Р / ${pro.name}`)
							.setStyle('SECONDARY'),
					);
				}

				const embed = new MessageEmbed()
					.setColor('#FF8C00')
					.setDescription(`📦 **Управление категорией:** \`${products.length} / ${categories.find(el => el.id == categoryId).name}\``);

				await b.deferUpdate(); return await b.editReply({ embeds: [embed], components: row });
			}

			if (b.customId.startsWith('catrename')) {
				const categoryId = (b.customId.match(IdRegex))[0];

				const renameCategory = new Modal()
					.setCustomId('renameCategory')
					.setTitle('Переименование категории')
					.addComponents(
						new MessageActionRow()
							.addComponents(
								new TextInputComponent()
									.setCustomId('name')
									.setLabel('Новое название')
									.setMaxLength(32)
									.setMinLength(2)
									.setPlaceholder('Пример названия')
									.setRequired(true)
									.setStyle('SHORT'),
							),
					);

				await b.showModal(renameCategory);

				const modalFilter = b => b.user.id == i.user.id && b.customId == 'renameCategory';
				const renameCategorySubmit = await b.awaitModalSubmit({ filter: modalFilter, time: 60000 });

				if (renameCategorySubmit) {
					const fields = {
						name: renameCategorySubmit.fields.getTextInputValue('name'),
					};

					let category = await Categories.findOne({ where: { name: { [Op.like]: fields.name } } });

					let embed;
					const row = new MessageActionRow()
						.addComponents(
							emptyButton(),
							emptyButton(),
							backButton(`catselect_${categoryId}`),
						);

					if (category) {
						embed = errorEmbed('Извините, но категория с таким именем уже существует');
					} else {
						category = categories.find(el => el.id == categoryId);
						
						category.name = fields.name;
						await category.save();

						embed = successEmbed(`Категория успешно переименована: \`${category.name}\``);
					}

					await renameCategorySubmit.deferUpdate(); return await renameCategorySubmit.editReply({ embeds: [embed], components: [row] });
				}
			}

			if (b.customId.startsWith('catcreate')) {
				const categoryId = (b.customId.match(IdRegex))[0];

				const createProduct = new Modal()
					.setCustomId('createProduct')
					.setTitle('Создание продукта')
					.addComponents(
						new MessageActionRow()
							.addComponents(
								new TextInputComponent()
									.setCustomId('name')
									.setLabel('Название')
									.setMaxLength(32)
									.setMinLength(2)
									.setPlaceholder('Пример названия')
									.setRequired(true)
									.setStyle('SHORT'),
							),
						new MessageActionRow()
							.addComponents(
								new TextInputComponent()
									.setCustomId('cost')
									.setLabel('Цена')
									.setMaxLength(32)
									.setMinLength(1)
									.setPlaceholder('100')
									.setRequired(true)
									.setStyle('SHORT'),
							),
					);

				await b.showModal(createProduct);

				const modalFilter = b => b.user.id == i.user.id && b.customId == 'createProduct'; 
				const createProductSubmit = await b.awaitModalSubmit({ filter: modalFilter, time: 60000 });

				if (createProductSubmit) {
					const fields = {
						name: createProductSubmit.fields.getTextInputValue('name'),
						cost: createProductSubmit.fields.getTextInputValue('cost'),
					};

					let product = await Products.findOne({ where: { name: { [Op.like]: fields.name } } });

					let embed;
					const row = new MessageActionRow()
						.addComponents(
							emptyButton(),
							emptyButton(),
							backButton(`catselect_${categoryId}`),
						);

					if (product) {
						embed = errorEmbed('Извините, но продукт с таким именем уже существует');
					} else {
						product = await Products.create({ categoryId: categoryId, name: fields.name, cost: fields.cost });

						embed = successEmbed(`Продукт создан: \`${product.name}\``);
					}

					await createProductSubmit.deferUpdate(); return await createProductSubmit.editReply({ embeds: [embed], components: [row] });
				}
			}

			if (b.customId.startsWith('catdelete')) {
				const categoryId = (b.customId.match(IdRegex))[0];

				const categoryDelete = new Modal()
					.setCustomId('categoryDelete')
					.setTitle('Удаление категории')
					.addComponents(
						new MessageActionRow()
							.addComponents(
								new TextInputComponent()
									.setCustomId('name')
									.setLabel(`Введите ${categories.find(el => el.id == categoryId).name} для подтверждения удаления`)
									.setMaxLength(32)
									.setMinLength(2)
									.setPlaceholder(`${categories.find(el => el.id == categoryId).name}`)
									.setRequired(true)
									.setStyle('SHORT'),
							),
					);

				await b.showModal(categoryDelete);

				const modalFilter = b => b.user.id == i.user.id && b.customId == 'categoryDelete';
				const categoryDeleteSubmit = await b.awaitModalSubmit({ filter: modalFilter, time: 60000 });

				if (categoryDeleteSubmit) {
					const fields = {
						name: categoryDeleteSubmit.fields.getTextInputValue('name'),
					};

					let embed;
					const row = new MessageActionRow()
						.addComponents(
							emptyButton(),
							emptyButton(),
							backButton('edit'),
						);

					if (fields.name === categories.find(el => el.id == categoryId).name) {
						let products = await Products.findAll({ where: { categoryId: categoryId } });

						for (let product of products) {
							await product.destroy();
						}

						await categories.find(el => el.id == categoryId).destroy();

						categories = await Categories.findAll();

						embed = successEmbed(`Категория \`${fields.name}\` успешно удалена`);
					} else {
						embed = errorEmbed('Неправильное имя категории');
					}

					await categoryDeleteSubmit.deferUpdate(); return await categoryDeleteSubmit.editReply({ embeds: [embed], components: [row] });
				}
			}

			if (b.customId.startsWith('proselect')) {
				const productId = (b.customId.match(IdRegex))[0];
				let product = await Products.findOne({ where: { id: productId }, include: ['category'] });

				let row = [];

				row.push(new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId(`prorename_${productId}`)
							.setLabel('Rename')
							.setStyle('SECONDARY')
							.setEmoji('🎟️'),
						new MessageButton()
							.setCustomId(`procost_${productId}`)
							.setLabel('Cost')
							.setStyle('SECONDARY')
							.setEmoji('💰'),
						new MessageButton()
							.setCustomId(`prodelete_${productId}`)
							.setLabel('Delete')
							.setStyle('SECONDARY')
							.setEmoji('🔨'),
						backButton(`catselect_${product.category.id}`),
					)
				);

				const embed = new MessageEmbed()
					.setColor('#FF8C00')
					.setDescription(`📦 **Управление товаром:** \`${product.cost}Р / ${product.name}\` **из категории** \`${categories.find(el => el.id == product.category.id).name}\``);

				await b.deferUpdate(); return await b.editReply({ embeds: [embed], components: row });
			}

			if (b.customId == 'home') {
				await b.deferUpdate(); return await b.editReply({ embeds: [homeEmbed], components: [homeRow] });
			}
		});
	},
};