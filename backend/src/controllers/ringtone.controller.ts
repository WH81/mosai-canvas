import { Request, Response } from "express";
import RingtoneService from "../services/ringtone.service";

const ringtoneService = new RingtoneService();

export default class RingtoneController {
  public async getAll(_: Request, res: Response): Promise<void> {
    try {
      const ringtones = await ringtoneService.getAll();
      res.json(ringtones);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ringtones" });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "Ringtone ID is required" });
        return;
      }
      const ringtone = await ringtoneService.getById(id);
      if (!ringtone) {
        res.status(404).json({ error: "Ringtone not found" });
        return;
      }
      res.json(ringtone);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ringtone" });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const ringtone = await ringtoneService.create(req.body);
      res.status(201).json(ringtone);
    } catch (error) {
      res.status(500).json({ error: "Failed to create ringtone" });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "Ringtone ID is required" });
        return;
      }
      const updated = await ringtoneService.update(id, req.body);
      if (!updated) {
        res.status(404).json({ error: "Ringtone not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update ringtone" });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "Ringtone ID is required" });
        return;
      }
      const deleted = await ringtoneService.delete(id);
      if (!deleted) {
        res.status(404).json({ error: "Ringtone not found" });
        return;
      }
      res.json({ message: "Ringtone deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete ringtone" });
    }
  }
}
