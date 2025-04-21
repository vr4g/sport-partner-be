import jwt from 'jsonwebtoken'
import { closeConnection, getConnection } from '../services/database.service'
import { convertDataObjectKeysToArray } from '../utils/utils'
import { PSQL_ERRORS } from '../utils/consts'
import { compare, hash } from '../utils/crypt'
import { createUserData, userData } from '../types/user.type'

export const verifyUserLogin = async (email: string, password: string) => {
  try {
    const user = await getUserByEmail(email)
    if (!user.length) {
      return { status: 'error', error: 'user not found' }
    }
    const comparePassword = await compare(password, user[0].password)
    if (comparePassword) {
      const accessToken = jwt.sign(
        {
          id: user[0].id,
          email: user[0].email,
          first_name: user[0].first_name,
          last_name: user[0].last_name,
          type: 'user',
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: '1h',
        },
      )
      const refreshToken = jwt.sign(
        {
          id: user[0].id,
          email: user[0].email,
          first_name: user[0].first_name,
          last_name: user[0].last_name,
        },
        process.env.JWT_REFRESH_SECRET!,
        {
          expiresIn: '7d',
        },
      )
      user[0].refresh_token = refreshToken
      await updateUserData(user[0])
      return { status: 'ok', data: accessToken }
    }
    return { status: 'error', error: 'invalid credentials' }
  } catch (error) {
    console.log(error)
    return { status: 'error', error: 'timed out' }
  }
}
export const verifyUserToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return { status: 'success', data: decoded }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { status: 'error', error: 'Token expired' }
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return { status: 'error', error: 'Invalid token' }
    }
    return { status: 'error', error: 'Authentication failed' }
  }
}

export const refreshAccessToken = async (id: number, email: string) => {
  try {
    if (!id || !email) {
      return { status: 'error', error: 'Missing user information' }
    }

    const userData = await getUserByEmail(email)
    if (!userData[0]?.refresh_token) {
      return { status: 'error', error: 'Refresh token is missing' }
    }

    const decoded = jwt.verify(userData[0]?.refresh_token, process.env.JWT_REFRESH_SECRET!)
    if (!decoded) {
      throw new Error('Invalid or expired refresh token')
    }

    const newAccessToken = jwt.sign(
      {
        id: userData[0].id,
        email: userData[0].email,
        first_name: userData[0].first_name,
        last_name: userData[0].last_name,
        type: 'user',
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' },
    )

    return { status: 'ok', data: newAccessToken }
  } catch (error) {
    return { status: 'error', error: 'Invalid or expired refresh token' }
  }
}

export const updateUserData = async (user: userData) => {
  let conn
  try {
    conn = await getConnection()
    if (!conn) {
      throw new Error('Database connection is missing')
    }
    const keys = convertDataObjectKeysToArray(user)
    const values = Object.values(user).filter((_, index) => Object.keys(user)[index] !== 'id')
    values.push(user.id)

    const targetParameterID = values.length
    const query = `UPDATE public.users SET ${keys} WHERE id=$${targetParameterID}`
    const resp = await conn.query(query, values)
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

export const addNewUser = async (user: createUserData) => {
  let conn
  try {
    conn = await getConnection()
    if (!conn) {
      throw new Error('Database connection is missing')
    }
    user.password = await hash(user.password)
    const keys = Object.keys(user).join(', ')
    const values = Object.values(user)
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ')

    const query = `INSERT INTO public.users (${keys}) VALUES (${placeholders}) RETURNING *;`

    const resp = await conn.query(query, values)
    return resp?.rows
  } catch (error: any) {
    console.log(error.message)
    if (error.code === PSQL_ERRORS.uniqueContraintExists) {
      return { error: 'User with this email already exists.' }
    }
    return error.message
  } finally {
    if (conn) {
      await closeConnection(conn)
    }
  }
}

export const deleteUser = async (userId: string) => {
  let conn
  try {
    conn = await getConnection()
    if (!conn) {
      throw new Error('Database connection is missing')
    }
    const query = `DELETE FROM public.users WHERE id=$1`
    const resp = await conn.query(query, [userId])
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

export const getUserByID = async (userId: string): Promise<userData[]> => {
  let conn
  try {
    conn = await getConnection()
    if (!conn) {
      throw new Error('Database connection is missing')
    }
    const query = `SELECT * FROM public.users WHERE id=$1`
    const resp = await conn.query(query, [userId])
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

export const getUserByEmail = async (email: string): Promise<userData[]> => {
  let conn
  try {
    conn = await getConnection()
    if (!conn) {
      throw new Error('Database connection is missing')
    }
    const query = `SELECT * FROM public.users WHERE email=$1`
    const resp = await conn.query(query, [email])
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
