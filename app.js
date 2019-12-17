const express = require("./node_modules/express")
const app = express()
const bodyParser = require("./node_modules/body-parser")
const exphbs = require("express-handlebars");
const hbs = require("handlebars");
const configRoutes = require("./routes");
const cookieParser = require('./node_modules/cookie-parser');
const session = require('./node_modules/express-session');
const static = express.static(__dirname + "/public");
const path = require('path');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use("/public", static);

app.set('views', path.join('views'))
app.set("view engine", "handlebars");
app.engine("handlebars", exphbs({ defaultLayout: false }));



hbs.registerHelper("log", function(something) {
    console.log(something);
  });


app.use(session({
    name: 'AuthCookie',
    secret: 'SECRETsecret!',
    resave: false,
    saveUninitialized: false,
}));
app.use('*',(req,res, next)=>{
    console.log("[%s]: %s %s (%s)",
       new Date().toUTCString(),
       req.method,
       req.originalUrl,
       `${req.session.user ? "Authenticated User" : "Non-Authenticated User"}`
       );
    next();
});

configRoutes(app)

app.use( (req, res, next) => {
    res.status(404).json({ error: "Not found" });
});

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});