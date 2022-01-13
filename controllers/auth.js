const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User-model');
const { generateJWT } = require('../helpers/jwt');
const { errorDBMessage } = require('../helpers/errorDbMessage');


const createUser = async (req, res = response) => {
    
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        
        if (!!user) {
            return res.status(400).json({
                ok: false,
                message: 'User already exists'
            });
        }

        user = new User( req.body );

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        const doc = await user.save();

        const token = await generateJWT( doc.id, doc.name );

        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        return errorDBMessage(error, res);
    }
};

const loginUser = async (req, res = response) => {
    
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!!!user) {
            return res.status(400).json({
                ok: false,
                message: 'incorrect email or password'
            });
        }

        //compare password
        const validPassword = bcrypt.compareSync( password, user.password );

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'incorrect email or password'
            });
        }

        const token = await generateJWT( user.id, user.name );

        return res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        return errorDBMessage(error, res);
    }
};

const revalidateToken = async (req, res = response) => {

    const { uid, name } = req;

    const token = await generateJWT( uid, name );

    return res.json({
        ok: true,
        token,
        uid,
        name
    });
};

module.exports = {
    createUser,
    loginUser,
    revalidateToken
};