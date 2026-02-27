import { Router } from 'express';
import { getMosques } from '../handlers/getMosques';
import { createMosque } from '../handlers/createMosque';
import { getMosqueTimings } from '../handlers/getMosqueTimings';
import { patchMosqueTimings } from '../handlers/patchMosqueTimings';

export const mosquesRouter = Router();

mosquesRouter.get('/', getMosques);
mosquesRouter.post('/', createMosque);
mosquesRouter.get('/:type/:osmId/timings', getMosqueTimings);
mosquesRouter.patch('/:type/:osmId/timings', patchMosqueTimings);
