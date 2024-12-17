import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const url = process.env.DATABASE_URL;
console.log("URL: ", url);

const port = process.env.PORT;
console.log(port);

const app = express();
app.use(cors());
app.use(express.json());

const client = new pg.Client(url);

const init = async () => {
  try {
    await client.connect();

    const SQL = `
        CREATE TABLE IF NOT EXISTS flavors(
        id SERIAL PRIMARY KEY,
        flavor_name TEXT,
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
        );

    `;

    await client.query(SQL);

    app.listen(port, () => console.log(`Listening to port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

init();

app.get("/api/flavors", async (req, res, next) => {
  try {
    const flavors = `SELECT * FROM flavors`;
    const response = await client.query(flavors);
    res.send(response.rows);
  } catch (error) {
    console.log("error fetching flavors: ", error);
    next(error);
  }
});

app.post("/api/flavors", async (req, res, next) => {
  const response = req.body;
  console.log("received: ", response.flavor_name);

  const SQL = `
    INSERT INTO flavors(flavor_name , is_favorite) VALUES( $1 , $2) RETURNING *;
  `;
  const result = await client.query(SQL, [
    response.flavor_name,
    response.is_favorite,
  ]);

  res.status(200).send(result.rows[0]);
});

app.get("/api/flavors/:id", async (req, res, next) => {
  try {
    console.log("id: ", req.params.id);

    const SQL = `
        SELECT * FROM flavors WHERE id = $1; 
    `;

    const data = await client.query(SQL, [req.params.id]);

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "Flavor not found" });
    }

    res.status(200).send(data.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.put("/api/flavors/:id", async (req, res, next) => {
  const data = req.body;
  try {
    const SQL = `
      UPDATE flavors SET flavor_name = $1, is_favorite = $2 , updated_at = now()
      WHERE id = $3 RETURNING *;
    `;

    const response = await client.query(SQL, [
      data.flavor_name,
      data.is_favorite,
      req.params.id,
    ]);
    res.send(response.rows[0]);
  } catch (error) {
    console.log("Error while updating a flavor: ", error);
    next(error);
  }
});

app.delete("/api/flavors/:id", async (req, res, next) => {
  try {
    const SQL = `
      DELETE FROM flavors
      WHERE id = $1;
    `;
    const response = await client.query(SQL, [req.params.id]);
    console.log("Successfully Deleted a Flavor!!");
    res.send(response.rows[0]);
  } catch (error) {
    console.log("Error while deleting a favor: ", error);
    next(error);
  }
});
