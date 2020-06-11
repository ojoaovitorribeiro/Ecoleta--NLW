import Knex from "knex";

export async function seed(knex: Knex) {
  await knex("items").insert([
    { title: "Lâmpada", img: "lampadas.svg" },
    { title: "Pilhas e Baterias", img: "baterias.svg" },
    { title: "eletronicos", img: "eletronicos.svg" },
    { title: "Papeis e Papelão", img: "papeis-papelao.svg" },
    { title: "Resíduos Organicos", img: "organicos.svg" },
    { title: "Oleo de Cozinha", img: "oleo.svg" },
  ]);
}
