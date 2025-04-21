const pgConnection = (responseCredentials: {
  user: string
  password: string
  host: string
  database: string
  port: string
}) => {
  const parsedCredentials = responseCredentials
  const { Client } = require('pg')
  const sql = new Client({
    user: parsedCredentials.user,
    password: parsedCredentials.password,
    host: parsedCredentials.host,
    database: parsedCredentials.database,
    port: parsedCredentials.port,
  })
  return sql
}

export const getConnection = async () => {
  const responseCredentials = {
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    host: process.env.DB_HOST!,
    database: process.env.DB_DATABASE!,
    port: process.env.DB_PORT!,
  }
  const sql = pgConnection(responseCredentials)
  try {
    await sql.connect()
    console.log('Connected to PG DB')
    return sql
  } catch (error) {
    console.error('Connection to PG DB failed!')
    throw new Error('Connection to dabatase failed')
  }
}

export const closeConnection = async (poolConnection: any) => {
  poolConnection.end()
}

export const selectAllFromTable = async (table: string) => {
  let conn
  try {
    conn = await getConnection()
    if (!conn) {
      throw new Error('Database connection is missing')
    }
    const query = `SELECT * FROM public.${table}`
    const resp = await conn.query(query)
    return resp?.rows
  } catch (error: any) {
    console.log(error.message)
    return error.message
  } finally {
    if (conn) {
      await closeConnection(conn)
    }
  }
}
