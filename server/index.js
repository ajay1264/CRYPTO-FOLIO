require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const dashboardRouter = require("./Routes/Dashboard");

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);



// Fix Access-Control-Allow-Origin Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Mongoose Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Database Connected Successfully");
    app.listen(process.env.PORT, () => console.log(`🚀 Server running on PORT ${process.env.PORT}`));
  })
  .catch((error) => console.error("❌ Database Connection Error:", error.message));


  mongoose.set("strictQuery", false);

// Routes
app.use("/dashboard", dashboardRouter);
app.use("/dashboard", require("./Routes/Userdetails"));
app.use("/dashboard", require("./Routes/ProfileUpdate"));
app.use("/register", require("./Routes/CreatUser"));
app.use("/register", require("./Routes/Signup"));
app.use("/transactions", require("./Routes/Transactions"));
app.use("/wallet", require("./Routes/Wallet"));
