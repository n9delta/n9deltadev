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

Products.belongsTo(Categories, { foreignKey: 'categoryId', as: 'category'} );
Items.belongsTo(Products, { foreignKey: 'productId', as: 'product'} );

/* Reflect.defineProperty(Categories, 'createCategory', {
	value: async function (name) {

	},
}); */

Reflect.defineProperty(Users, 'findOneUser', {
	value: async function (parameters) {
		let user = await Users.findOne({ where: parameters });
		if (!user) user = Users.create({ userId: parameters.userId, balance: 0 });

		return user;
	},
});

module.exports = { Users, Categories, Products }