import { Router } from 'express';
import { getMosques } from '../handlers/getMosques';
import { getMosqueTimings } from '../handlers/getMosqueTimings';

export const mosquesRouter = Router();

mosquesRouter.get('/', getMosques);
mosquesRouter.get('/:id/timings', getMosqueTimings);
