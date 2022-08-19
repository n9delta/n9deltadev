const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);

Reflect.defineProperty(Users, 'findOneUser', {
	value: async function (parameters) {
		let user = await Users.findOne({ where: parameters });
		if (!user) user = Users.create({ userId: parameters.userId, balance: 0 });

		return user;
	},
});

module.exports = { Users }