import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('postgres', 'postgres', 'passw0rd', {
  host: 'localhost',
  dialect: 'postgres',
  logging:false
});