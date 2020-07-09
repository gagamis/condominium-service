const status = require("http-status");

const { 
    userCondominiumsAsync,
    registerCondominiumAsync,
    addCondominiumUsersAsync,
    deleteCondominiumUsersAsync
} = require("../service/condominium");


// @desc Check API healthy
// @route POST /health
// @access Public
exports.getHealth = async (req, res, next) => res.status(status.OK).json({ status: "OK" });

// @desc Get user's condominiums
// @route GET /user/condominiums
// @access Public
exports.getuserCondominiums = async (req, res, next) =>  await userCondominiumsAsync(req, res);

// @desc Register condominium
// @route POST /register
// @access Public
exports.registerCondominium = async (req, res, next) => await registerCondominiumAsync(req, res);

// @desc Add condominium's user
// @route POST /condominium/users
// @access Public
exports.addCondominiumUsers = async (req, res, next) => await addCondominiumUsersAsync(req, res);

// @desc Delete condominium's user
// @route POST /condominium/users
// @access Public
exports.deleteCondominiumUsers = async (req, res, next) => await deleteCondominiumUsersAsync(req, res);