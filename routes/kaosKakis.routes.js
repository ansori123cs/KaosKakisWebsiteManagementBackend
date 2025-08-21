import { Router } from 'express';
import authorize from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { createKaosKaki, deleteKaosKaki, getAllKaosKaki, getKaosKakiById, getKaosKakiByName, updateKaosKaki } from '../controllers//transaction/kaos.controller.js';

const kaosKakiRouter = Router();

kaosKakiRouter.get('/', getAllKaosKaki);
kaosKakiRouter.get('/search', getKaosKakiByName);

kaosKakiRouter.get('/:id', getKaosKakiById);

kaosKakiRouter.post(
  '/',
  authorize,
  (req, res, next) => {
    const productName = req.body.namaKaosKaki || 'KaosKakisImages';

    req.nameFolder = productName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    next();
  },
  upload.array('images', 10),
  createKaosKaki
);

kaosKakiRouter.put('/:id', updateKaosKaki);

kaosKakiRouter.delete('/:id', deleteKaosKaki);

export default kaosKakiRouter;
