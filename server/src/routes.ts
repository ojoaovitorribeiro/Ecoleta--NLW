import express from "express";
const routes = express.Router();
import multer from "multer";
import { Joi, celebrate } from "celebrate";
import multerConfig from "../src/config/multer";

import PointsController from "./controllers/PointsController";
import ItemsController from "./controllers/ItemsController";

const pointsController = new PointsController();
const itemsController = new ItemsController();

const upload = multer(multerConfig);

//cadastrar pontos de coleta

routes.post(
  "/points",
  upload.single("img"),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
      }),
    },
    { abortEarly: false }
  ),
  pointsController.create
);

routes.get("/points/:id", pointsController.show);
routes.get("/points/", pointsController.index);
routes.get("/pointsAll/", pointsController.indexx);

//listar itens
routes.get("/items", itemsController.index);

export default routes;
