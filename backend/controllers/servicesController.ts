import { Request, Response } from "express";
import * as servicesModel from "../models/servicesModel.js";

export const getServices = (req: Request, res: Response) => {
  const services = servicesModel.getAllServices();
  res.json(services);
};
