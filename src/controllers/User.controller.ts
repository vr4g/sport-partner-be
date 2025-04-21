import { AsyncWrapper } from '../middlewares/asyncWrapper.middleware'
import {
  deleteUser,
  updateUserData,
  verifyUserLogin,
  addNewUser,
  verifyUserToken,
  refreshAccessToken,
} from '../models/User.model'
import { selectAllFromTable } from '../services/database.service'
import { Router, Request, Response } from 'express'

const UserController = Router()

UserController.post(
  '/login',
  AsyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const response = await verifyUserLogin(email, password)
    if (response.status === 'ok') {
      res.cookie('token', response.data, {
        maxAge: 12 * 60 * 60 * 1000,
        httpOnly: true,
      })
      res.status(200).send(response)
    } else {
      res.status(403).send(response)
    }
  }),
)

UserController.post(
  '/signup',
  AsyncWrapper(async (req: Request, res: Response) => {
    const { data } = req.body
    const response = await addNewUser(data)
    if (response.length === 1) {
      res.status(200).send(response)
    } else {
      res.status(403).send(response)
    }
  }),
)

UserController.post(
  '/refreshToken',
  AsyncWrapper(async (req: Request, res: Response) => {
    const { id, email } = req.body
    const response = await refreshAccessToken(id, email)
    if (response.status === 'ok') {
      res.status(200).send(response)
    } else {
      res.status(403).send(response)
    }
  }),
)

UserController.get(
  '/verify',
  AsyncWrapper(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]
    const response = verifyUserToken(token || '')
    if (response.data) {
      res.status(200).send(response)
    } else {
      res.status(403).send(response)
    }
  }),
)

UserController.post(
  '/',
  AsyncWrapper(async (req: Request, res: Response) => {
    const body = req.body
    const resp = await addNewUser(body)
    if (resp) {
      res.status(200).send(resp)
    } else {
      res.status(403).send(resp)
    }
  }),
)

UserController.get(
  '/:id',
  AsyncWrapper(async (req: Request, res: Response) => {
    const body = req.body
    const resp = await addNewUser(body)
    if (resp) {
      res.status(200).send(resp)
    } else {
      res.status(403).send(resp)
    }
  }),
)

UserController.put(
  '/',
  AsyncWrapper(async (req: Request, res: Response) => {
    const body = req.body
    const resp = await updateUserData(body)
    if (resp) {
      res.status(200).send(resp)
    } else {
      res.status(403).send(resp)
    }
  }),
)

UserController.delete(
  '/:id',
  AsyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params
    const resp = await deleteUser(id)
    if (resp) {
      res.status(200).send(resp)
    } else {
      res.status(403).send(resp)
    }
  }),
)

UserController.get(
  '/',
  AsyncWrapper(async (req: Request, res: Response) => {
    const resp = await selectAllFromTable('users')
    if (resp) {
      res.status(200).send(resp)
    } else {
      res.status(403).send(resp)
    }
  }),
)

export default UserController
