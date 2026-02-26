import { Router } from 'express';
import { getMosques } from '../handlers/getMosques';
import { getMosqueTimings } from '../handlers/getMosqueTimings';
import { patchMosqueTimings } from '../handlers/patchMosqueTimings';

export const mosquesRouter = Router();

mosquesRouter.get('/', getMosques);
mosquesRouter.get('/:type/:osmId/timings', getMosqueTimings);
mosquesRouter.patch('/:type/:osmId/timings', patchMosqueTimings);
