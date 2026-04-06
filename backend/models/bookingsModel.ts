import db from "../database/db.js";

export const getBookingsByDate = (date: string) => {
  return db.prepare(`SELECT time FROM bookings WHERE date = ? AND status = 'confirmed'`).all(date) as { time: string }[];
};

export const getBlockedSlotsByDate = (date: string) => {
  return db.prepare(`SELECT time FROM blocked_slots WHERE date = ?`).all(date) as { time: string }[];
};

export const checkExistingBookingOrBlock = (date: string, time: string) => {
  const existingBooking = db.prepare(`SELECT id FROM bookings WHERE date = ? AND time = ? AND status = 'confirmed'`).get(date, time);
  const existingBlock = db.prepare(`SELECT id FROM blocked_slots WHERE date = ? AND time = ?`).get(date, time);
  return existingBooking || existingBlock;
};

export const createBooking = (id: string, serviceId: string, clientName: string, clientPhone: string, date: string, time: string, createdAt: string) => {
  return db.prepare(`
    INSERT INTO bookings (id, serviceId, clientName, clientPhone, date, time, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, 'confirmed', ?)
  `).run(id, serviceId, clientName, clientPhone, date, time, createdAt);
};

export const getClientBookings = (phone: string) => {
  return db.prepare(`SELECT * FROM bookings WHERE clientPhone = ?`).all(phone);
};

export const getAllAdminBookings = () => {
  return db.prepare(`SELECT * FROM bookings`).all();
};

export const cancelBooking = (id: string) => {
  return db.prepare(`DELETE FROM bookings WHERE id = ?`).run(id);
};

export const completeBooking = (id: string) => {
  return db.prepare(`UPDATE bookings SET status = 'completed' WHERE id = ?`).run(id);
};

export const blockSlot = (id: string, date: string, time: string) => {
  return db.prepare(`INSERT INTO blocked_slots (id, date, time) VALUES (?, ?, ?)`).run(id, date, time);
};

export const unblockSlot = (date: string, time: string) => {
  return db.prepare(`DELETE FROM blocked_slots WHERE date = ? AND time = ?`).run(date, time);
};
