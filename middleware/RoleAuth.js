function RoleAuth(...allowedRole) {

    console.log(allowedRole);

    return function (req, res, next) {

        console.log(req.user);

        // USER NOT FOUND
        if (!req.user) {

            return res.status(401).send({
                message: "Unauthorized"
            });
        }

        // ROLE CHECK
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