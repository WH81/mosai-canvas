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
) => {
  const cleanData: Partial<IMailingList> = {};
  if (data.email) {
    cleanData.email = String(data.email).toLowerCase().trim();
  }

  return MailingList.findByIdAndUpdate(
    String(id),
    { $set: cleanData },
    { new: true }
  );
};

export const updateEntryByEmail = async (
  email: string,
  data: Partial<IMailingList>
) => {
  const cleanData: Partial<IMailingList> = {};
  if (data.email) {
    cleanData.email = String(data.email).toLowerCase().trim();
  }

  return MailingList.findOneAndUpdate(
    { email: String(email).toLowerCase().trim() },
    { $set: cleanData },
    { new: true }
  );
};

export const deleteEntry = async (id: string) =>
  MailingList.findByIdAndDelete(String(id));