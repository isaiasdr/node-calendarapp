/* 
    routes for auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/fieldValidator');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

const PASSWORD_MIN_LENGTH = parseInt(process.env.MIN_LENGTH_PASSWORD);

//route handler
router.post(
    '/new', 
    [
        check('name', 'name is required').not().isEmpty(),
        check('email', 'email is required').normalizeEmail().isEmail(),
        check('password', 'password is required').not().isEmpty(),
        check('password', 'password too short').isLength({ min: PASSWORD_MIN_LENGTH }),
        fieldValidator
    ], 
    createUser
);

router.post(
    '/', 
    [
        check('email', 'email is required').normalizeEmail().isEmail(),
        check('password', 'password is required').not().isEmpty(),
        check('password', 'password too short').isLength({ min: PASSWORD_MIN_LENGTH }),
        fieldValidator
    ], 
    loginUser
);

router.get('/renew', validateJWT, revalidateToken);

module.exports = router;