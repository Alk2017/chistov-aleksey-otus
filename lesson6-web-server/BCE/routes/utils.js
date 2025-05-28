function handleError(err, message='Internal Server Error', res)  {
    console.error('Error:', err);
    const errorResponse = {
        code: 500,
        message: message,
        // details: process.env.NODE_ENV === 'development' ? err.message : undefined
        details: err.message
    };
    res.status(500).json(errorResponse);
}

module.exports = {
    handleError
}