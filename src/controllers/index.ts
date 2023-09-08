
import { RoleController as ROLE_APIS } from "./role/role.controller";
import { RoleValidators as ROLE_VALIDATOR } from "./role/role.validator";
import { UserController as USER_APIS } from "./user/user.controller";
import { UserValidators as USER_VALIDATOR } from "./user/user.validator";


export const controller = {

    ROLE: {
        APIS: ROLE_APIS,
        VALIDATOR: ROLE_VALIDATOR,
    },
    USER: {
        APIS: USER_APIS,
        VALIDATOR: USER_VALIDATOR,
    }

}