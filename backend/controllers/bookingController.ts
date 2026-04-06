import { Request, Response } from "express";
import { format, parseISO, addMinutes } from "date-fns";
import * as bookingsModel from "../models/bookingsModel.js";

export const getAvailability = (req: Request, res: Response) => {
  const { date } = req.query;
  if (!date || typeof date !== "string") {
    res.status(400).json({ error: "Date is required" });
    return;
  }

  const bookings = bookingsModel.getBookingsByDate(date);
  const blocked = bookingsModel.getBlockedSlotsByDate(date);
  
  const bookedTimes = new Set(bookings.map(b => b.time));
  const blockedTimes = new Set(blocked.map(b => b.time));

  const slots = [];
  const startTime = "13:00"; // 1:00 PM
  const endTime = "22:00";   // 10:00 PM
  const interval = 30;

  // Check if it's Monday
  const dayOfWeek = parseISO(date).getDay();
  if (dayOfWeek === 1) { // 1 = Monday
    res.json([]);
    return;
  }

  let current = parseISO(`${date}T${startTime}`);
  const end = parseISO(`${date}T${endTime}`);

  while (current < end) {
    const timeStr = format(current, "HH:mm");
    
    const isBooked = bookedTimes.has(timeStr);
    const isBlocked = blockedTimes.has(timeStr);

    slots.push({
      time: timeStr,
      status: isBlocked ? "blocked" : isBooked ? "booked" : "available",
    });

    current = addMinutes(current, interval);
  }

  res.json(slots);
};

export const createBooking = (req: Request, res: Response) => {
  const { serviceId, clientName, clientPhone, date, time } = req.body;

  if (!serviceId || !clientName || !clientPhone || !date || !time) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (bookingsModel.checkExistingBookingOrBlock(date, time)) {
    res.status(409).json({ error: "Time slot is no longer available" });
    return;
  }

  const id = Math.random().toString(36).substr(2, 9);
  const createdAt = new Date().toISOString();

  bookingsModel.createBooking(id, serviceId, clientName, clientPhone, date, time, createdAt);

  req.app.get('io').emit("bookings_updated"); // Notify admin dashboard
  
  res.status(201).json({ id, serviceId, clientName, clientPhone, date, time, status: "confirmed", createdAt });
};

export const getClientBookings = (req: Request, res: Response) => {
  const { phone } = req.query;
  if (!phone || typeof phone !== "string") {
    res.status(400).json({ error: "Phone number is required" });
    return;
  }
  const clientBookings = bookingsModel.getClientBookings(phone);
  res.json(clientBookings);
};
