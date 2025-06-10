import MailingList from '../models/mailing-list.model';
import { IMailingList } from '../interfaces/mailing-list.interface';

export const createEntry = async (data: IMailingList) => MailingList.create(data);

export const getAllEntries = async () => MailingList.find();

export const getEntryById = async (id: string) => MailingList.findById(id);

export const updateEntry = async (id: string, data: Partial<IMailingList>) => 
  MailingList.findByIdAndUpdate(id, data, { new: true });

export const deleteEntry = async (id: string) => MailingList.findByIdAndDelete(id);
