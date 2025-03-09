import express from "express";
import { 
    getCarouselItems, 
    getCarouselItemById, 
    createCarouselItem, 
    updateCarouselItem, 
    deleteCarouselItem 
} from "../controllers/carouselController";
import { validateCarouselItem } from "../middleware/validateCarouselItem"; // Middleware import

const router = express.Router();

// Get all carousel items
router.get("/", getCarouselItems);

// Get a single carousel item by ID
router.get("/:id", getCarouselItemById);

// Create a new carousel item (with validation middleware)
router.post("/", validateCarouselItem, createCarouselItem);

// Update an existing carousel item by ID (with validation middleware)
router.put("/:id", validateCarouselItem, updateCarouselItem);

// Delete a carousel item by ID
router.delete("/:id", deleteCarouselItem);

export default router;
