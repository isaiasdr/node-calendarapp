/* 
    routes for events
    host + /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { fieldValidator } = require('../middlewares/fieldValidator');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

//all routes need to have a valid token
router.use(validateJWT);

//route handler
router.get('/', getEvents);

router.post('/', [
    check('title', 'Title is required').not().isEmpty(),
    check('start', 'Date start format is not valid').custom( isDate ),
    check('end', 'Date end format is not valid').custom( isDate ),
    fieldValidator
], createEvent);

router.put('/:id', updateEvent);

router.delete('/:id', deleteEvent);

module.exports = router;