const { response } = require('express');
const Event = require('../models/Event-model');
const { errorDBMessage } = require('../helpers/errorDbMessage');

const getEvents = async (req, res = response) => {

    try {
        const events = await Event.find().populate('user', 'name');

        return res.status(200).json({
            ok: true,
            events
        });

    } catch (error) {
        return errorDBMessage(error, res);
    }
};

const createEvent = async (req, res = response) => {

    try {
        const event = new Event( req.body );

        event.user = req.uid;

        const eventSaved =  await event.save();
        
        return res.status(201).json({
            ok: true,
            event : eventSaved
        });

    } catch (error) {
        return errorDBMessage(error, res);
    }
};

const updateEvent = async (req, res = response) => {

    const eventId = req.params.id;

    try {
        const event = await Event.findById( eventId );

        if (!event) {
            return res.status(404).json({
                ok: false,
                message: 'Event not found'
            });
        }

        if (event.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                message: 'Not authorized'
            });
        }

        const newEvent = { ...req.body, user: req.uid };

        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        return res.status(200).json({
            ok: true,
            event: eventUpdated
        });

    } catch (error) {
        return errorDBMessage(error, res);
    }
};

const deleteEvent = async (req, res = response) => {

    const eventId = req.params.id;

    try {
        const event = await Event.findById( eventId );

        if (!event) {
            return res.status(404).json({
                ok: false,
                message: 'Event not found'
            });
        }

        if (event.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                message: 'Not authorized'
            });
        }

        await Event.findByIdAndDelete( eventId );

        return res.status(200).json({
            ok: true
        });
        
    } catch (error) {
        return errorDBMessage(error, res);
    }
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
};