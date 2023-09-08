import { Router } from 'express'
import { controller } from '../controllers'

const router = Router()


// /* Post Apis */
router.post( '/create-role', controller.ROLE.VALIDATOR.createRole, controller.ROLE.APIS.createRole )


// /* Get Apis */
router.get( '/', controller.ROLE.APIS.getRole )


export default router
