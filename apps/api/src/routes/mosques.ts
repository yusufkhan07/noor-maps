import { Router } from 'express';
import { getMosques } from '../handlers/getMosques';
import { getMosqueTimings } from '../handlers/getMosqueTimings';
import { patchMosqueTimings } from '../handlers/patchMosqueTimings';

export const mosquesRouter = Router();

mosquesRouter.get('/', getMosques);
mosquesRouter.get('/:id/timings', getMosqueTimings);
mosquesRouter.patch('/:id/timings', patchMosqueTimings);
