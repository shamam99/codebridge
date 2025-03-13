require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("./middlewares/googleAuth");
const connectDB = require("./database/db");
const normalizeId = require("./middlewares/normalizeIdMiddleware");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(normalizeId);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        }),
        cookie: {
            secure: false, // Use true if you're on HTTPS
            httpOnly: true,
            sameSite: "lax", // Add this to ensure the cookie is sent correctly
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/translate", require("./routes/translateRoutes"));
app.use("/api/community", require("./routes/communityRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/code/pages", require("./routes/codePageRoutes"));




const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
