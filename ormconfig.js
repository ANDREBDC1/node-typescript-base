module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'DbBarber',
  entities: [
    `${process.env.DB_PATH_MODELS}`
  ],
  migrations: [
     `${process.env.DB_PATH_MIGRATIONS}`
  ],
  cli: {
    migrationsDir: './src/database/migrations'

  }
}
