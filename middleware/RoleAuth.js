function RoleAuth(...allowedRole) {
    console.log(allowedRole)

    return function (req, res, next) {
        console.log(req.user)
        
        if(!req.user){
            return res.status(400).send("bad request");
        }
        if(allowedRole.includes(req.user.role)){
            next()
        } else {
            return res.status(400).send(" only seller can use this api");
        }
    }

}
module.exports = RoleAuth;