import Release from "../models/release.model";
import { IRelease } from "../interfaces/release.interface";

export const getReleases = async (filter: any = {}): Promise<IRelease[]> => {
  return await Release.find(filter).sort({ releaseDate: -1 }).lean();
};

export const getReleaseById = async (id: string): Promise<IRelease | null> =>
  await Release.findById(id);

export const createRelease = async (data: IRelease): Promise<IRelease> =>
  await Release.create(data);

export const updateRelease = async (
  id: string,
  data: IRelease
): Promise<IRelease | null> =>
  await Release.findByIdAndUpdate(id, data, { new: true });
  
export const deleteRelease = async (id: string): Promise<IRelease | null> =>
  await Release.findByIdAndDelete(id);
