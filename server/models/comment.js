
export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  });
  Comment.associate = (models) => {
    Comment.belongsTo(models.Article, {
      foreignKey: 'articleSlug',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Comment.hasMany(models.Comment, {
      foreignKey: 'parentId',
      as: 'child',
    });
    Comment.belongsTo(models.Comment, {
      foreignKey: 'parentId',
      as: 'parent',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'author',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Comment;
};
