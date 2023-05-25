import OracleDB from "oracledb";
import { Sequelize } from "sequelize-typescript";


OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
OracleDB.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_10' });

const USERNAME = process.env.ORACLEDB_USER || "system";
const PASSWORD = process.env.ORACLEDB_PASSWORD || "oracle";
const CONNECTIONSTRING = process.env.ORACLEDB_CONNECTIONSTRING || "localhost:1521/orcl";

const logger = (sql: string, timing?: number | undefined) => {
    console.log(`SQL${ timing ? ` (${timing.toLocaleString()}ms)` : ""}: ${sql} `)
}

const logging = process.env.NODE_ENV === "development" ? logger : false;

async function connect(): Promise<Sequelize> {
    const database = new Sequelize({
        dialect: "oracle",
        quoteIdentifiers: false,
        username: USERNAME,
        password: PASSWORD,
        logging: logging,
        dialectOptions: {
            connectString: CONNECTIONSTRING,
        },
        sync: { force: false, alter: false },
        models: [__dirname + '/models/*.model.ts'],
    });

    await database.authenticate()

    return database;
}

export default connect;

// Path: src\database.ts
