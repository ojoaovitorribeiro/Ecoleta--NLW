import knex from "../database/connection";
import { Request, Response } from "express";

class ItemsController {
  async index(req: Request, res: Response) {
    const items = await knex("items").select("*");

    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        img_url: `http://192.168.42.3:3333/uploads/${item.img}`,
      };
    });

    console.log("funcionou AAAAAAAAAAAA");
    return res.json(serializedItems);
  }
}
export default ItemsController;
