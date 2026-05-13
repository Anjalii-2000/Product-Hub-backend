function RoleAuth(...allowedRole) {

    return function (req, res, next) {

        // CHECK USER
        if (!req.user) {

            return res.status(401).send({
                message: "Unauthorized"
            });
        }

        // CHECK ROLE
        if (allowedRole.includes(req.user.role)) {

            next();

        } else {

            return res.status(403).send({
                message: "Access Denied"
            });
        }
    };
}

module.exports = RoleAuth;