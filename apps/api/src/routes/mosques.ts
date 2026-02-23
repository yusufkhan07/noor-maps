import { Router } from 'express';
import { getMosques } from '../handlers/getMosques';

export const mosquesRouter = Router();

mosquesRouter.get('/', getMosques);
