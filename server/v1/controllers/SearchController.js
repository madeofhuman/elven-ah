import models from '../../models';
import queryHelper from '../helpers/queryHelper';

const { User, Tag, Article } = models;

/**
 * This class handles user search operations.
 */
class SearchController {
  /**
   * Re-sends a verification email to the user
   * @param {object} req the request object
   * @param {object} res the response object
   * @returns {object} the article, tag, users arrays of objects.
   */
  static async searchProcess(req, res, next) {
    const keyword = req.query.q;
    try {
      const userSearch = await User.findAll({
        where: { $or: { username: { $ilike: `%${keyword}%` }, firstName: { $ilike: `%${keyword}%` }, lastName: { $ilike: `%${keyword}%` }, }, },
        order: [
          ['username', 'DESC']
        ],
      });

      const articleSearch = await Article
        .findAll(Object.assign({}, queryHelper.allArticles, {
          where: { $or: { title: { $ilike: `%${keyword}%` }, body: { $ilike: `%${keyword}%` }, }, },
          order: [
            ['createdAt', 'DESC']
          ],
        }));

      const tagSearch = await Tag
        .findAll(Object.assign({}, queryHelper.allTags, {
          where: { $or: { title: { $ilike: `%${keyword}%` }, } },
          order: [
            ['createdAt', 'DESC']
          ],
        }));

      return res.status(200).json({
        status: 'success',
        result: {
          userSearch,
          articleSearch,
          tagSearch,
        }
      });
    } catch (err) { next(err); }
  }
}

export default SearchController;