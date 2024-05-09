const express = require("express");
const cors = require("cors");
const path = require("path");

const { buildResponse, emails, rules, rand } = require("./helpers");

const server = express();

server.use(express.json());

server.use(express.static(path.join(__dirname, "../dist")));

server.use(cors());

server.post("/api/result", async (req, res) => {
  const [status, payload] = await buildResponse(req);
  res.status(status).json(payload);
});

server.get("/users", (req, res) => {
  res.status(200).json([...emails]);
  //res.sendFile(path.join(__dirname, '../dist/index.html'))
});

server.get("/rules", (req, res) => {
  res.status(200).json(rules);
});
// todo: path : '/rand' [0, 8] random number generate
server.get("/rand", (req, res) => {
  const randomNumber = rand(2, 8);
  res.status(200).json({ randomNumber });
});

let TreasureIndex = -1
let maxSteps = -1
// todo: /randDimention [3, 7]
server.get("/randDimension", (req, res) => {
  const rows = rand(3, 5);
  const cols = rand(3, 5);

  const treasureRandom = rand(1, rows * cols);
  TreasureIndex = treasureRandom -1
  console.log(TreasureIndex)
  maxSteps = Math.floor(rows * cols / 2) // temp Algo. Will be developed further. 
  res.status(200).json({
    rows,
    cols,
    maxSteps
  });
});


server.post("/checkTreasury", async (req, res) => {
  const { currentIndex, StepsTaken } = req.body;

  try {

    if (currentIndex === TreasureIndex && StepsTaken <=maxSteps) {
      console.log("treausre hit!")
      res.json({
        reachedTreasure: true,
        message: "Congratulations! You found the treasure!",
      });
    } else {
      res.json({ reachedTreasure: false, message: "Keep searching!" });
    }
  } catch (error) {
    console.error("Error checking treasury:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

server.use((req, res) => {
  res.status(404).json({
    message: `Endpoint [${req.method}] ${req.originalUrl} does not exist`,
  });
});

module.exports = server;
