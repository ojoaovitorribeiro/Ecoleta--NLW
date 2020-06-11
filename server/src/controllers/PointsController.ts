import knex from "../database/connection";
import { Request, Response } from "express";

class PointsController {
  //listar um ponto especifico
  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex("points").where("id", id).first();

    if (!point) {
      return res.status(400).json({ message: "Point not found..." });
    }
    const serializedPoint = {
      ...point,
      img_url: `http://192.168.42.3:3333/uploads/${point.img}`,
    };

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id);

    return res.json({ point: serializedPoint, items });
  }
  //listar todos os pontos com filtro
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    // console.log(city, uf, items);

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        img_url: `http://192.168.42.3:3333/uploads/${point.img}`,
      };
    });

    return res.json(serializedPoints);
  }
  async indexx(req: Request, res: Response) {
    const todosospontos = await knex("points").select("*");

    console.log("funcionou pegou todos");
    return res.json(todosospontos);
  }

  //criar ponto de coleta com os items
  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;

    const trx = await knex.transaction();
    const points = {
      img: req.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };
    const insertedIds = await trx("points").insert(points);

    // inserir chave estrnahgeria
    const point_id = insertedIds[0];

    const pointItems = items
      .split(",")
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          point_id,
        };
      });

    await trx("point_items").insert(pointItems);
    await trx.commit();

    return res.json({ id: point_id, ...points });
  }
}

export default PointsController;
