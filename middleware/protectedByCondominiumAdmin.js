const status = require("http-status");

async function protectedByCondominiumAdmin(req, res, next) {

    try {
        const x_auth_user = req.get('x-auth-user');
        if(!x_auth_user) 
            throw 'X-AUTH-USER not found';
        
        const user = JSON.parse(x_auth_user);
        if(!user) 
            throw 'Not valid user in X-AUTH-USER header';

        const { condominium_id }= req.body;               
        const { roles } = user;

        if(user.root || roles.some(x => x.condominiumId === condominium_id && x.roleName === 'condominium_admin'))
            return next();

        throw 'user has no condominium_admin role';

    } catch (error) {
        console.error(error);
        return res.status(status.UNAUTHORIZED).json({
            success: false,
            statusCode: status.UNAUTHORIZED,
            error: status[`${status.UNAUTHORIZED}_NAME`]
        });
    }
}

module.exports = protectedByCondominiumAdmin;