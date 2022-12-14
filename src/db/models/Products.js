module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Products', {
		categoryId: DataTypes.INTEGER,
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		cost: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};