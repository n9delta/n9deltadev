module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Categories', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
	}, {
		timestamps: false,
	});
};