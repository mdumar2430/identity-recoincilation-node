import { Request, ResponseToolkit } from "@hapi/hapi";
import * as ContactService from "../../services/contacts/index.js";

export const getContactsHandler = async (
  request: Request,
  h: ResponseToolkit
) => {
  const contacts = await ContactService.findAll();
  return h.response(contacts).code(200);
};
