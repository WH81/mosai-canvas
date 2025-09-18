import Ringtone, { IRingtoneModel } from "../models/ringtone.model";
import { IRingtone } from "../interfaces/ringtone.interface";

export default class RingtoneService {
  public async getAll(): Promise<IRingtoneModel[]> {
    return Ringtone.find();
  }

  public async getById(id: string): Promise<IRingtoneModel | null> {
    return Ringtone.findById(id);
  }

  public async create(data: IRingtone): Promise<IRingtoneModel> {
    const ringtone = new Ringtone(data);
    return ringtone.save();
  }

  public async update(id: string, data: Partial<IRingtone>): Promise<IRingtoneModel | null> {
    return Ringtone.findByIdAndUpdate(id, data, { new: true });
  }

  public async delete(id: string): Promise<IRingtoneModel | null> {
    return Ringtone.findByIdAndDelete(id);
  }
}
