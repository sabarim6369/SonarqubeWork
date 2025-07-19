const express = require("express");
const app = express();
const cors = require("cors");
const connectToDB = require("./config/db");
const dotenv = require("dotenv").config();
const axios=require("axios")
const PORT = 8000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
); 
 
app.use(express.json());

connectToDB(); 

const tokenRoutes = require("./routes/tokenRoutes");
const adminRoutes = require("./routes/adminRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const studentRoutes = require("./routes/studentRoutes");

app.use("/api/admin", adminRoutes);
app.use("/api/token", tokenRoutes); 
app.use("/api/trainer", trainerRoutes);
app.use("/api/student", studentRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});
app.post('/api/run', async (req, res) => {
  const { language, code } = req.body;

  try {
    // Define the version for the language (for example, '3' for Python 3)
    const languageVersion = language === 'python3' ? '3' : 'latest';  // Adjust the version based on the language

    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: language || "python3",
        version: languageVersion, // Add the version here
        source: code,
        files: [
          {
            name: `code.${language === "python3" ? "py" : language}`, // Generate a file name based on the language
            content: code, // The actual source code content (UTF-8 encoded)
          },
        ],
      }
    );
console.log(response.data);
    res.json(response.data)
  } catch (error) {
    console.error('Execution error:', error);
    if (error.response) {
      // Log response details from the server
      console.error('Error response:', error.response.data);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error('Error request:', error.request);
    } else {
      console.error('General error:', error.message);
    }
    res.status(500).json({ error: 'Error running code' });
  }
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
