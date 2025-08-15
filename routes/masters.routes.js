import { Router } from 'express';
import authorize from '../middleware/auth.middleware.js';
import { createNewJenisBahan, createNewJenisMesin, createNewJenisUkuran, createNewJenisWarna } from '../controllers/master.controller.js';

const mastersRoutes = Router();

//new JenisBahan
mastersRoutes.post('/newJenisBahan', authorize, createNewJenisBahan);
//new JenisMesin
mastersRoutes.post('/newJenisMesin', authorize, createNewJenisMesin);
//new JenisUkuran
mastersRoutes.post('/newJenisUkuran', authorize, createNewJenisUkuran);
//new JenisWarna
mastersRoutes.post('/newJenisWarna', authorize, createNewJenisWarna);

export default mastersRoutes;
