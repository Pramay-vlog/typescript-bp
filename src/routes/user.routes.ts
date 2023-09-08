import { Router } from 'express'
import { controller } from '../controllers'
import auth from '../middlewares/auth'
import enums from '../constants/enums'
const router = Router()


/* Get Apis */
router.get( '/fetch', auth( { usersAllowed: [ "*" ] } ), controller.USER.VALIDATOR.get, controller.USER.APIS.get )
router.get( '/dashboard-counts', auth( { usersAllowed: [ enums.ROLE.ADMIN ] } ), controller.USER.APIS.dashboard_counts )


/* Post Apis */
router.post( '/register', controller.USER.VALIDATOR.signUp, controller.USER.APIS.signUp )
router.post( '/login', controller.USER.VALIDATOR.signIn, controller.USER.APIS.signIn )
router.post( '/forgot-password', controller.USER.VALIDATOR.forgotPassword, controller.USER.APIS.forgotPassword )
router.post( '/verify-otp', controller.USER.VALIDATOR.verifyOtp, controller.USER.APIS.verifyOtp )
router.post( '/change-forgot-password', controller.USER.VALIDATOR.changeForgotPassword, controller.USER.APIS.changeForgotPassword )


/* Put Apis */
router.put( '/change-password', auth( { usersAllowed: [ "*" ] } ), controller.USER.VALIDATOR.changePassword, controller.USER.APIS.changePassword )
router.put( '/update/:_id', auth( { usersAllowed: [ '*' ] } ), controller.USER.VALIDATOR.update, controller.USER.APIS.update )


/* Delete Apis */
router.delete( '/:_id', auth( { usersAllowed: [ enums.ROLE.ADMIN ] } ), controller.USER.VALIDATOR.toggleActive, controller.USER.APIS.delete )


export default router
