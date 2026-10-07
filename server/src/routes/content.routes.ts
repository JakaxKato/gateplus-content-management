import { Router } from 'express';
import {
  createContent,
  deleteContent,
  getContentById,
  listContents,
  updateContent,
} from '../controllers/content.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { contentBodySchema, listContentsQuerySchema } from '../schemas/content.schema.js';

export const contentRouter = Router();

contentRouter.get('/', validate(listContentsQuerySchema, 'query'), listContents);
contentRouter.get('/:id', getContentById);
contentRouter.post('/', requireAuth, validate(contentBodySchema), createContent);
contentRouter.put('/:id', requireAuth, validate(contentBodySchema), updateContent);
contentRouter.delete('/:id', requireAuth, deleteContent);
