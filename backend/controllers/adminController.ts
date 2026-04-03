import { Request, Response } from "express";
import * as bookingsModel from "../models/bookingsModel.js";

const ADMIN_PASSWORD = "barber_admin";

export const loginAdmin = (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: "fake-jwt-token" });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
};

export const getAdminBookings = (req: Request, res: Response) => {
  const bookings = bookingsModel.getAllAdminBookings();
  res.json(bookings);
};

export const cancelAdminBooking = (req: Request, res: Response) => {
  const { id } = req.params;
  const result = bookingsModel.cancelBooking(id);
  if (result.changes > 0) {
    req.app.get('io').emit("bookings_updated"); // Notify admin dashboard
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Booking not found" });
  }
};

export const completeAdminBooking = (req: Request, res: Response) => {
  const { id } = req.params;
  const result = bookingsModel.completeBooking(id);
  if (result.changes > 0) {
    req.app.get('io').emit("bookings_updated"); // Notify admin dashboard
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Booking not found" });
  }
};

export const blockTimeSlot = (req: Request, res: Response) => {
  const { date, time } = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  bookingsModel.blockSlot(id, date, time);
  
  req.app.get('io').emit("bookings_updated"); // Notify admin dashboard
  res.json({ success: true, id });
};

export const unblockTimeSlot = (req: Request, res: Response) => {
  const { date, time } = req.params;
  bookingsModel.unblockSlot(date, time);
  
  req.app.get('io').emit("bookings_updated"); // Notify admin dashboard
  res.json({ success: true });
};
