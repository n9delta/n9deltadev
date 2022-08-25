module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Items', {
		productId: DataTypes.INTEGER,
		value: {
			type: DataTypes.STRING,
			unique: true,
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	}, {
		timestamps: false,
	});
};