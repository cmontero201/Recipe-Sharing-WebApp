const loginRoutes = require("./login")
const authRoutes = require("./auth")
const postRoutes = require("./posts")
const userRoutes = require("./users")

const constructorMethod = app => {
    
    app.use("/posts", postRoutes);
    app.use("/", loginRoutes);
    app.use("/auth", authRoutes)
    app.use("/users", userRoutes)


    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
}
module.exports = constructorMethod