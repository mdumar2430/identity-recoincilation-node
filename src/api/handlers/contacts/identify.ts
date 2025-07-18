import { Request, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import * as ContactService from "../../services/contacts/index.js";

export const identifyPayloadSchema = Joi.object({
  email: Joi.string().email().allow(null).optional(),
  phoneNumber: Joi.number().allow(null).optional(),
}).required();

interface IdentifyPayload {
  email?: string;
  phoneNumber?: number;
}
interface IdentifyResponse {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}
/**
 * POST /identify handler
 */
export const identifyHandler = async (request: Request, h: ResponseToolkit) => {
  const { email, phoneNumber } = request.payload as IdentifyPayload;

  if (!email && !phoneNumber) {
    return h.response({ error: "Missing email or phoneNumber" }).code(400);
  }

  const existing = await ContactService.findMatches(
    email ?? null,
    phoneNumber ?? null
  );

  // If no existing contacts, create a new primary
  if (existing.length === 0) {
    const contact = await ContactService.create({
      email: email ?? null,
      phoneNumber: phoneNumber ?? null,
      linkPrecedence: "primary",
    });

    return h
      .response({
        primaryContactId: contact.id,
        emails: email ? [email] : [],
        phoneNumbers: phoneNumber ? [phoneNumber] : [],
        secondaryContactIds: [],
      })
      .code(201);
  }

  // Find the primary record (oldest with linkPrecedence = 'primary')
  let primary =
    existing
      .filter((c) => c.linkPrecedence === "primary")
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0] ??
    existing[0];

  // Update all others to be secondary
  for (const c of existing) {
    if (c.id !== primary.id && c.linkPrecedence !== "secondary") {
      await ContactService.update(c.id, {
        linkedId: primary.id,
        linkPrecedence: "secondary",
      });
    }
  }

  // Re-fetch all linked contacts (primary + secondaries)
  const matchingContacts = await ContactService.findMatches(
    email ?? null,
    phoneNumber ?? null
  );

  const emails = new Set<string>();
  const phoneNumbers = new Set<string>();
  const secondaryIds: number[] = [];

  for (const c of matchingContacts) {
    if (c.email) emails.add(c.email);
    if (c.phoneNumber) phoneNumbers.add(c.phoneNumber.toString());
    if (c.linkPrecedence === "secondary") secondaryIds.push(c.id);
  }

  // If current (email + phone) pair not in DB, add it as secondary
  const alreadyExists = matchingContacts.find(
    (c) => c.email === email && c.phoneNumber == phoneNumber
  );

  if (!alreadyExists) {
    const newSecondary = await ContactService.create({
      email: email ?? null,
      phoneNumber: phoneNumber ?? null,
      linkPrecedence: "secondary",
      linkedId: primary.id,
    });

    if (newSecondary.email) emails.add(newSecondary.email);
    if (newSecondary.phoneNumber)
      phoneNumbers.add(newSecondary.phoneNumber.toString());
    secondaryIds.push(newSecondary.id);
  }

  const response: IdentifyResponse = {
    primaryContactId: primary.id,
    emails: Array.from(emails),
    phoneNumbers: Array.from(phoneNumbers),
    secondaryContactIds: secondaryIds,
  };

  return h.response(response).code(200);
};
