import { Request, ResponseToolkit } from "@hapi/hapi";
import * as ContactService from "../../services/contacts/index.js";
import Joi from "joi";

export const createContactPayloadSchema = Joi.object({
  email: Joi.string().email().allow(null),
  phoneNumber: Joi.number().allow(null),
  linkPrecedence: Joi.string().valid("primary", "secondary").optional(),
  linkedId: Joi.number().integer().allow(null).optional(),
});

export const createContactHandler = async (
  request: Request,
  h: ResponseToolkit
) => {
  const {
    email,
    phoneNumber,
    linkPrecedence = "primary",
    linkedId = null,
  } = request.payload as any;

  const contact = await ContactService.create({
    email,
    phoneNumber,
    linkPrecedence,
    linkedId,
  });

  return h.response(contact).code(201);
};
