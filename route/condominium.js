const express = require("express");
const router = express.Router();

const validator = require("../middleware/validator");
const protectedBy_x_auth_user = require('../middleware/protectedByForwardAuth');
const protectedByRootRole = require('../middleware/protectedByRootRole');
const protectedByCondominiumAdmin = require('../middleware/protectedByCondominiumAdmin');
const protectedByCondominiumUser = require('../middleware/protectedByCondominiumUser');

const { 
    getHealth,
    getuserCondominiums,
    registerCondominium,
    addCondominiumUsers,
    deleteCondominiumUsers
} = require("../controller/condominium");

const {
    registerSchema,
    addUserSchema,
    deleteUserSchema
  } = require("../model/validatorSchema");

router.get("/health", getHealth); // get service status

router.get("/user/condominiums", protectedBy_x_auth_user, protectedByCondominiumUser, getuserCondominiums);

router.post("/register", protectedBy_x_auth_user, protectedByRootRole, validator(registerSchema), registerCondominium); // registering a new condominium
router.post("/condominium/users", protectedBy_x_auth_user, protectedByCondominiumAdmin, validator(addUserSchema), addCondominiumUsers);
router.delete("/condominium/users", protectedBy_x_auth_user, protectedByCondominiumAdmin, validator(deleteUserSchema), deleteCondominiumUsers);

module.exports = router;