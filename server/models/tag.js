export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {});
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Article, {
      through: 'ArticleTags',
      as: 'articles',
      foreignKey: 'tagId',
    });
  };
  return Tag;
};
