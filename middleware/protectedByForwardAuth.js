const status = require("http-status");

async function protectedBy_x_auth_user(req, res, next) {

    try {
        const x_auth_user = req.get('x-auth-user');
        if(!x_auth_user) 
            throw 'X-AUTH-USER not found';
        
        const user = JSON.parse(x_auth_user);
        if(!user) 
            throw 'Not valid user in X-AUTH-USER header';

        next();

    } catch (error) {
        return res.status(status.UNAUTHORIZED).json({
            success: false,
            statusCode: status.UNAUTHORIZED,
            error: status[`${status.UNAUTHORIZED}_NAME`]
        });
    }
}

module.exports = protectedBy_x_auth_user;