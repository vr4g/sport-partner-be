import { Router } from 'express'
import UserController from '@/controllers/User.controller'

const router = Router()

router.use('/', UserController)

export default router
