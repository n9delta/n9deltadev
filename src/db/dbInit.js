const fs = require('node:fs');
const path = require('node:path');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);
const Categories = require('./models/Categories.js')(sequelize, Sequelize.DataTypes);
const Products = require('./models/Products.js')(sequelize, Sequelize.DataTypes);
const Items = require('./models/Items.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const categories = [
		Categories.upsert({ name: 'Nitro' }),
		Categories.upsert({ name: 'Tokens' }),
		Categories.upsert({ name: 'Sofa' }),
		Categories.upsert({ name: 'Negri' }),
		Categories.upsert({ name: 'Aboba' }),
		Categories.upsert({ name: 'Ernich' }),

		Products.upsert({ categoryId: 1, name: 'Full', cost: 150 }),
		Products.upsert({ categoryId: 1, name: 'Classic', cost: 100 }),

		Products.upsert({ categoryId: 2, name: 'With Paypal', cost: 250 }),
		Products.upsert({ categoryId: 2, name: 'Without Paypal', cost: 100 }),

		Items.upsert({ productId: 1, value: 'ссылка', userId: null }),
		Items.upsert({ productId: 1, value: 'ссылка2', userId: null }),
		Items.upsert({ productId: 2, value: 'ссылка3', userId: null }),
		Items.upsert({ productId: 2, value: 'ссылка4', userId: null }),
	];

	await Promise.all(categories);
	console.log('Database synced');
	
	sequelize.close();
}).catch(console.error);