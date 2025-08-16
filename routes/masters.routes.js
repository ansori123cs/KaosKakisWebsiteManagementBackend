import { Router } from 'express';
import authorize from '../middleware/auth.middleware.js';
import { createNewJenisBahan, deleteJenisBahan, getAllJenisBahan, updateJenisBahan } from '../controllers/master/jenis-bahan.controller.js';
import { createNewJenisMesin, deleteJenisMesin, getAllJenisMesin, updateJenisMesin } from '../controllers/master/jenis-mesin.controller.js';
import { createNewJenisWarna, deleteJenisWarna, getAllJenisWarna, updateJenisWarna } from '../controllers/master/warna.controller.js';
import { createNewJenisUkuran, deleteJenisUkuran, getAllJenisUkuran, updateJenisUkuran } from '../controllers/master/ukuran.controller.js';

const mastersRoutes = Router();

//Jenis Bahan
mastersRoutes.get('/listJenisBahan', authorize, getAllJenisBahan); //get JenisBahan with paging

mastersRoutes.post('/newJenisBahan', authorize, createNewJenisBahan); //new JenisBahan

mastersRoutes.post('/updateJenisBahan', authorize, updateJenisBahan); //update JenisBahan

mastersRoutes.post('/deleteJenisBahan', authorize, deleteJenisBahan); //delete JenisBahan

//========================================================================================//

//Jenis Mesin
mastersRoutes.get('/listJenisMesin', authorize, getAllJenisMesin); //get JenisMesin with paging

mastersRoutes.post('/newJenisMesin', authorize, createNewJenisMesin); //new JenisMesin

mastersRoutes.post('/updateJenisMesin', authorize, updateJenisMesin); //update JenisMesin

mastersRoutes.post('/deleteJenisMesin', authorize, deleteJenisMesin); //delete JenisMesin

//========================================================================================//

//Jenis Warna
mastersRoutes.get('/listJenisWarna', authorize, getAllJenisWarna); //get JenisWarna with paging

mastersRoutes.post('/newJenisWarna', authorize, createNewJenisWarna); //new JenisWarna

mastersRoutes.post('/updateJenisWarna', authorize, updateJenisWarna); //update JenisWarna

mastersRoutes.post('/deleteJenisWarna', authorize, deleteJenisWarna); //delete JenisWarna

//========================================================================================//

//Jenis Ukuran
mastersRoutes.get('/listJenisUkuran', authorize, getAllJenisUkuran); //get JenisUkuran with paging

mastersRoutes.post('/newJenisUkuran', authorize, createNewJenisUkuran); //new JenisUkuran

mastersRoutes.post('/updateJenisUkuran', authorize, updateJenisUkuran); //update JenisUkuran

mastersRoutes.post('/deleteJenisUkuran', authorize, deleteJenisUkuran); //delete JenisUkuran

export default mastersRoutes;
