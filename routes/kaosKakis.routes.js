import { Router } from 'express';
import authorize from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { createDataMesin, createJenisBahan, createKaosKaki, deleteKaosKaki, getAllKaosKaki, getKaosKakiById, updateKaosKaki } from '../controllers/kaos.controller.js';

const kaosKakiRouter = Router();

kaosKakiRouter.get('/', getAllKaosKaki);

kaosKakiRouter.get('/:id', getKaosKakiById);

kaosKakiRouter.post(
  '/',
  authorize,
  (req, res, next) => {
    const productName = req.body.namaKaosKaki || 'KaosKakisImages';
    console.log(req.body);
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

kaosKakiRouter.post('/bahan', authorize, createJenisBahan);

kaosKakiRouter.post('/mesin', authorize, createDataMesin);

export default kaosKakiRouter;
