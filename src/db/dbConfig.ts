import { Sequelize } from "sequelize";

export function connect() {
  try {
    const connection = new Sequelize({
      dialect: "sqlite",
      storage: "./src/db/db.sqlite",
      logging: false,
    });
    return connection;
  } catch (error) {
    console.log(error);
  }
}
