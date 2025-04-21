import { Router } from 'express'
import SportsController from '../controllers/Sports.controller'

const router = Router()

router.use('/', SportsController)

export default router
