import express from "express";
import { 
    getAbout, 
    getAboutById, 
    createAbout, 
    updateAbout, 
    deleteAbout 
} from "../controllers/aboutController";
import { validateAbout } from "../middleware/validateAbout"; // Middleware import

const router = express.Router();

// Get all carousel items
router.get("/", getAbout);

// Get a single carousel item by ID
router.get("/:id", getAboutById);

// Create a new carousel item (with validation middleware)
router.post("/", validateAbout, createAbout);

// Update an existing carousel item by ID (with validation middleware)
router.put("/:id", validateAbout, updateAbout);

// Delete a carousel item by ID
router.delete("/:id", deleteAbout);

export default router;
