const status = require("http-status");
const bson = require('bson');
var mongoose = require('mongoose');
const Condominiums = require("../model/Condominium");

//add user into condominium
async function addCondominiumUsersAsync(req, res) {

    try {

        const x_auth_user = req.get('x-auth-user');       
        const user = JSON.parse(x_auth_user);
        const { userId } = user;


        if(!userId)
            return res.status(status.BAD_REQUEST).json({
                success: false,
                statusCode: status.BAD_REQUEST
            });

        const { condominium_id, users } = req.body;
        
        const condominium = await Condominiums.findById(condominium_id);
        if(!condominium)
            return res.status(status.BAD_REQUEST).json({
                success: false,
                statusCode: status.BAD_REQUEST,
                data: `condominium not exist with id of ${condominium_id}`
            });
        
        users.forEach(x => {

            if(!condominium.condominium_users.includes(x))
                condominium.condominium_users.push(x);
        });

        await condominium.save();

        return res.status(status.OK).json({
            success: true,
            statusCode: status.OK
        });


    } catch (error) {
        console.error(error);

        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: status.INTERNAL_SERVER_ERROR,
            error: status[`${status.INTERNAL_SERVER_ERROR}_NAME`]
        });
    }
}
exports.addCondominiumUsersAsync = addCondominiumUsersAsync;

// delete user from condominium
async function deleteCondominiumUsersAsync(req, res) {

    try {

        const x_auth_user = req.get('x-auth-user');       
        const user = JSON.parse(x_auth_user);
        const { userId, roles } = user;

        if(!userId)
            return res.status(status.BAD_REQUEST).json({
                success: false,
                statusCode: status.BAD_REQUEST
            });
          

        const { condominium_id, users } = req.body;
    
        const condominium = await Condominiums.findById(condominium_id);
        if(!condominium)
            return res.status(status.BAD_REQUEST).json({
                success: false,
                statusCode: status.BAD_REQUEST,
                data: `condominium not exist with id of ${condominium_id}`
            });
        

            users.forEach(x => {

                if(condominium.condominium_users.includes(x))
                    condominium.condominium_users.pull(x);
            });

        await condominium.save();

        return res.status(status.OK).json({
            success: true,
            statusCode: status.OK
        });


    } catch (error) {
        console.error(error);

        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: status.INTERNAL_SERVER_ERROR,
            error: status[`${status.INTERNAL_SERVER_ERROR}_NAME`]
        });
    }
}
exports.deleteCondominiumUsersAsync = deleteCondominiumUsersAsync;

// get user's condominiums
async function userCondominiumsAsync(req, res) {
    try {

        const x_auth_user = req.get('x-auth-user');       
        const user = JSON.parse(x_auth_user);
        const { userId } = user;

        if(!userId)
            return res.status(status.BAD_REQUEST).json({
                success: false,
                statusCode: status.BAD_REQUEST
            });


        // get condominiums where userId in condominium_users
        const condominiums = await Condominiums.find({"condominium_users": userId })

        return res.status(status.OK).json({
            success: true,
            statusCode: status.OK,
            condominiums: condominiums.map(m =>  {
                return {
                    id: m.id,
                    name: m.name,
                    representative: m.representative_id
                };
            })
        });

    } catch (error) {
        console.error(error);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: status.INTERNAL_SERVER_ERROR,
            error: status[`${status.INTERNAL_SERVER_ERROR}_NAME`]
        });
    }
}
exports.userCondominiumsAsync = userCondominiumsAsync;

// register new condominium
async function registerCondominiumAsync(req, res) {
    try {
                
        console.log(req.body);

        // add condominium
        const { represntativeId, name, user } = req.body;
        if (await Condominiums.findOne({ name: name }))

        // check condominium is exist or not
        return res.status(status.BAD_REQUEST).json({
            success: false,
            statusCode: status.BAD_REQUEST,
            errors: [
                {
                    name: "name",
                    error: "condominium with the same name has been exist"
                }
            ]
        });

        if(!mongoose.Types.ObjectId.isValid(represntativeId))
            return res.status(status.BAD_REQUEST).json({
                success: false,
                statusCode: status.BAD_REQUEST,
                errors: [
                    {
                        name: "represntativeId",
                        error: "represntativeId is not valide"
                    }
                ]
            });
        

        var newCondominium = new Condominiums({
            name: name,
            representative_id: new mongoose.Types.ObjectId(represntativeId)
        });


        let condominium = await Condominiums.create(newCondominium);
        return res.status(status.OK).json({
            success: true,
            statusCode: status.OK,
            condominiumId: newCondominium.id
        });

    } catch (error) {
        console.error(error);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: status.INTERNAL_SERVER_ERROR,
            error: status[`${status.INTERNAL_SERVER_ERROR}_NAME`]
        });
    }
}
exports.registerCondominiumAsync = registerCondominiumAsync;