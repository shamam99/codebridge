require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const passport = require("./middlewares/googleAuth");
const connectDB = require("./database/db");
const normalizeId = require("./middlewares/normalizeIdMiddleware");
const path = require("path");
const fs = require("fs");


// Ensure uploads/projects exists
const uploadDir = path.join(__dirname, "uploads/projects");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
            secure: false, 
            httpOnly: true,
            sameSite: "lax", 
        },
    })
);

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

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
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/admin/dashboard", require("./routes/adminDashboardRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));





const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
