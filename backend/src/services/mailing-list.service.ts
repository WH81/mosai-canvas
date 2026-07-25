import MailingList from '../models/mailing-list.model';
import { IMailingList } from '../interfaces/mailing-list.interface';

export const createEntry = async (data: IMailingList) =>
  MailingList.create(data);

export const getAllEntries = async () => MailingList.find();

export const getEntryById = async (id: string) =>
  MailingList.findById(String(id));

export const getEntryByEmail = async (email: string) =>
  MailingList.findOne({ email: String(email).toLowerCase().trim() });

export const updateEntry = async (
  id: string,
  data: Partial<IMailingList>
) => MailingList.findByIdAndUpdate(String(id), { $set: data }, { new: true });

export const updateEntryByEmail = async (
  email: string,
  data: Partial<IMailingList>
) =>
  MailingList.findOneAndUpdate(
    { email: String(email).toLowerCase().trim() },
    { $set: data },
    { new: true }
  );

export const deleteEntry = async (id: string) =>
  MailingList.findByIdAndDelete(String(id));