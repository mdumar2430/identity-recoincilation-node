import { Op } from 'sequelize';
import { Contact } from '../../models/Contact.js';

/**
 * Finds all contacts that match the given email or phone number.
 * @param email Contact's email
 * @param phoneNumber Contact's phone number
 * @returns Matching Contact records
 */
export const findMatches = async (
  email: string | null,
  phoneNumber: number | null
): Promise<Contact[]> => {
  const conditions = [];

  if (email) {
    conditions.push({ email });
  }

  if (phoneNumber) {
    conditions.push({ phoneNumber });
  }

  if (conditions.length === 0) {
    return [];
  }

  return Contact.findAll({
    where: {
      [Op.or]: conditions,
    },
  });
};

/**
 * Creates a new contact.
 * @param data Partial<Contact> - Email, phoneNumber, linkPrecedence, linkedId
 * @returns Created Contact instance
 */
export const create = async (
  data: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>
): Promise<Contact> => {
  return Contact.create(data);
};

/**
 * Updates a contact by ID.
 * @param id Contact ID
 * @param data Fields to update
 * @returns Number of affected rows
 */
export const update = async (
  id: number,
  data: Partial<Contact>
): Promise<[affectedCount: number]> => {
  return Contact.update(data, { where: { id } });
};

/**
 * Find all contacts.
 * @returns Fetches all contact rows
 */
export const findAll = async (): Promise<Contact[]> => {
  return Contact.findAll();
};