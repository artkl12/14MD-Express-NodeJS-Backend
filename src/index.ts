import express from "express";
const cors = require("cors");
const bodyParser = require("body-parser");
import { connection } from "./db";
const app = express();
const port = 3001;
app.use(bodyParser.json());
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", async (req, res) => {
  res.json({ message: "Hello from server" });
});

app.get("/cities", async (req, res) => {
  // Execute the query to get all cities
  connection.query("SELECT * FROM cities", (error, results) => {
    if (error) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Send the cities as a JSON response
    res.json(results);
  });
});

app.post("/city", async (req, res) => {
  const { name, description, description2 } = req.body;
  if (!name || !description || !description2) {
    res.status(400).send("Invalid data");
    return;
  }
  connection.query(
    `
  INSERT INTO cities (name, description, description2)
  VALUES ('${name}', '${description}', '${description2}');
  `,
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json(results);
    }
  );
});

app.delete("/city/:id", async (req, res) => {
  const { id } = req.params;
  connection.query(
    `
    DELETE FROM cities WHERE id = '${id}';
    `,
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json(results);
    }
  );
});

app.put("/city/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, description2 } = req.body;
  connection.query(
    `
    UPDATE cities
    SET name = '${name}', description = '${description}', description2= '${description2}'
    WHERE id = '${id}';
    `,
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json(results);
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
