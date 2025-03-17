import About from '../models/About';
import { IAbout } from '../models/About';

// Function to get all About data
export const getAbout = async (): Promise<IAbout[]> => {
  try {
    return await About.find(); // Returns an array of about items
  } catch (error) {
    throw new Error('Error fetching About data: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

// Function to get a single About item by ID
export const getAboutById = async (id: string): Promise<IAbout | null> => {
  try {
    return await About.findById(id);
  } catch (error) {
    throw new Error('Error fetching About by ID: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

// Function to create a new About item
export const createAbout = async (data: { title: string; body: string }): Promise<IAbout> => {
  try {
    const newAbout = new About(data);
    return await newAbout.save();
  } catch (error) {
    throw new Error('Error creating About data: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

// Function to update an existing About item by ID
export const updateAbout = async (id: string, data: { title: string; body: string }): Promise<IAbout | null> => {
  try {
    return await About.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    throw new Error('Error updating About data: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

// Function to delete an About item by ID
export const deleteAbout = async (id: string): Promise<{ message: string }> => {
  try {
    const result = await About.findByIdAndDelete(id);
    if (!result) {
      throw new Error('About item not found');
    }
    return { message: 'About data deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting About data: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};
