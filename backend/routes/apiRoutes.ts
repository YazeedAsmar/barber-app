import { Router } from "express";
import * as servicesController from "../controllers/servicesController.js";
import * as bookingController from "../controllers/bookingController.js";
import * as adminController from "../controllers/adminController.js";

const router = Router();

// Services
router.get("/services", servicesController.getServices);

// Public Bookings
router.get("/availability", bookingController.getAvailability);
router.post("/bookings", bookingController.createBooking);
router.get("/client/bookings", bookingController.getClientBookings);

// Admin
router.post("/admin/login", adminController.loginAdmin);
router.get("/admin/bookings", adminController.getAdminBookings);
router.delete("/admin/bookings/:id", adminController.cancelAdminBooking);
router.put("/admin/bookings/:id/complete", adminController.completeAdminBooking);
router.post("/admin/block", adminController.blockTimeSlot);
router.delete("/admin/block/:date/:time", adminController.unblockTimeSlot);

export default router;
