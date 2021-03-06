import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import isLoggedIn from '../middlewares/isLoggedIn';
import ArticleValidation from '../middlewares/validations/ArticleValidation';
import CommentValidation from '../middlewares/validations/CommentValidation';
import CommentController from '../controllers/CommentController';
import RatingController from '../controllers/RatingController';
import plagiarismCheck from '../middlewares/plagiarismCheck';
import validateSlug from '../middlewares/validateSlug';

const articleRouter = Router();

articleRouter.post('/', isLoggedIn, ArticleValidation.validateCreateArticle, plagiarismCheck, ArticleController.createArticle);

articleRouter.put('/:slug', isLoggedIn, ArticleValidation.validateUpdateArticle, ArticleController.updateArticle);

articleRouter.delete('/:slug', isLoggedIn, ArticleController.removeArticle);

articleRouter.post('/:slug/comments', isLoggedIn, validateSlug, CommentValidation.validateComment, CommentController.createComment);

articleRouter.get('/:slug/comments', isLoggedIn, validateSlug, CommentController.getComments);

articleRouter.get('/:slug/comments/:id', isLoggedIn, validateSlug, CommentController.getComment);

articleRouter.put('/:slug/comments/:id', isLoggedIn, validateSlug, CommentValidation.validateComment, CommentController.updateComment);

articleRouter.delete('/:slug/comments/:id', isLoggedIn, validateSlug, CommentController.deleteComment);

articleRouter.post('/:author/:slug/:rating', isLoggedIn, RatingController.prepRating);

articleRouter.get('/', ArticleValidation.paginationValidation, ArticleController.getAllArticles);

articleRouter.get('/:slug', ArticleController.getSingleArticle);

export default articleRouter;
