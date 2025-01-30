import { Sequelize } from "sequelize-typescript";

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL ?? "", {
    dialect: "postgres",
    models: [__dirname + "/models"],
    timezone: "utc",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: false,
});

export default sequelize;
