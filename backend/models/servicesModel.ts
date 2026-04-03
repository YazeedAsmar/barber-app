import db from "../database/db.js";

export const getAllServices = () => {
  return db.prepare(`SELECT * FROM services`).all();
};
