const pool = require("../../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateRandomAlphanumeric = require("../../utils/utils");

const ControllerFunctions = {
  verifyToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extracting the token

    console.log("token", token);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
  },
  getUsers: (req, res) => {
    pool.query("SELECT * FROM demo_db", (error, results) => {
      if (error) {
        console.log("error connecting database");
        throw error;
      }
      res.status(200).json(results.rows);
    });
    res.send("Hello from getUsers");
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Received login request:", email, password);
      // Query to find the user by email
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = result.rows[0];

      // Append the secret key to the incoming password and compare
      const isMatch = await bcrypt.compare(
        password + process.env.SECRET_KEY,
        user.password
      );
      console.log(isMatch);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      console.log("user", user);
      const token = jwt.sign(
        {
          username: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log(process.env.JWT_SECRET);
      // If password matches, return success response
      res.status(200).json({
        message: "Login successful",
        user: { id: user.id, email: user.email, accessToken: token },
      });
    } catch (error) {
      console.error("Error during login:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  createUser: async (req, res) => {
    try {
      const { firstname, lastname, email, password, username } = req.body;
      console.log(req.body);
      const created_at = new Date();
      // const reselyu = await pool.query("SELECT * FROM users");

      // Ensure the password is a string
      if (typeof password !== "string") {
        return res.status(400).json({ message: "Password must be a string" });
      }
      async function hashedPasswordWithSecretKey(password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(
          password + process.env.SECRET_KEY,
          salt
        );
        return hashedPassword;
      }
      const caseNumber = await generateRandomAlphanumeric();
      console.log("caseNumber", caseNumber);
      // Hash the password
      const hashedPassword = await hashedPasswordWithSecretKey(password);
      console.log(hashedPassword);
      // Insert into the database
      const result = await pool.query(
        "INSERT INTO users (firstname, lastname, email, username, password, created_at, case_no) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id",
        [
          firstname,
          lastname,
          email,
          username,
          hashedPassword,
          created_at,
          caseNumber,
        ]
      );
      console.log("added success fully", result.rows);
      // Send the response after the query completes
      return res
        .status(201)
        .json({ message: "User added", id: result.rows[0].id });
    } catch (error) {
      console.error("Error creating user:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  searchUser: async (req, res) => {
    const { firstname, lastname, case_no } = req.query;
    console.log(firstname, lastname, case_no);

    try {
      // Initialize base query and values array
      let query = "SELECT * FROM users WHERE";
      let values = [];
      let paramIndex = 1;
      // Check if case_no is provided and construct the query accordingly
      if (case_no && case_no !== "") {
        query += " case_no = $" + paramIndex;
        values.push(case_no);
        paramIndex += 1;
      }
      // If case_no is not provided, prioritize firstname in the query
      if (!case_no && firstname && firstname !== "") {
        query += ` firstName ILIKE $${paramIndex}`;
        values.push(`%${firstname}%`);
        paramIndex += 1;
      }
      // Add optional lastname condition
      if (lastname && lastname !== "") {
        query += ` AND lastName ILIKE $${paramIndex}`;
        values.push(`%${lastname}%`);
      }

      // If neither case_no nor firstname is provided, return an error
      if (values.length === 0) {
        return res
          .status(400)
          .json({ message: "Either firstname or case_no is required" });
      }
      const userDetails = await pool.query(query, values);

      res.status(200).json(userDetails.rows);
    } catch (error) {
      console.error("Error searching users:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      const result = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res
        .status(200)
        .json({ message: "User deleted successfully", user: result.rows[0] });
    } catch (error) {
      console.error("Error deleting user:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
module.exports = ControllerFunctions;
