const errorDBMessage = (err, res) => {
    console.log(err);

    return res.status(500).json({
        ok: false,
        message: 'Put in contact with the administrator',
    });
};

module.exports = {
    errorDBMessage
}