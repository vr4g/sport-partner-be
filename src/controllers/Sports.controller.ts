import { Request, Response, Router } from 'express'
import { AsyncWrapper } from '../middlewares/asyncWrapper.middleware'
import { selectAllFromTable } from '../services/database.service'

const SportsController = Router()

SportsController.get(
  '/groups',
  AsyncWrapper(async (req: Request, res: Response) => {
    const resp = await selectAllFromTable('group')
    if (resp) {
      res.status(200).send(resp)
    } else {
      res.status(403).send(resp)
    }
  }),
)

export default SportsController
