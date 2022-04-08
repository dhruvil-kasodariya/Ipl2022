const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("X-HTTP-Method-Override"));

mongoose.connect("mongodb://localhost:27017/ipl2022", {
  useNewUrlParser: true,
});

const playerInfoSchema = {
  playerName: { type: String },
  playerTeam: { type: String },
  role: { type: String },
  playerStatus: { type: String },
};

const Player = mongoose.model("Player", playerInfoSchema);

// app.get("/api/get", (req, res) => {

//     Player.find((error, results) => {
//         if (error) {
//             console.(error);
//         } else {
//             const filters = req.query;
//             const filteredUsers = results.filter(results => {
//                 let isValid = true;
//                 for (key in filters) {
//                     console.log(key, results[key], filters[key]);
//                     isValid = isValid && results[key] == filters[key];
//                 }
//                 return isValid;
//             });
//             res.send(filteredUsers);
//         }
//         res.json(res.paginatedResults);
//     })
// })

// read any one data of collection
app.get("/api/get/:id", async (req, res) => {
  try {
    const player = await Player.find({ _id: req.params.id });
    res.send(player);
  } catch {
    console.log(Error);
  }
});

//create new data in collection
app.post("/api/post", async (req, res) => {
  console.log(req.body);
  try {
    const newPlayer = await new Player({
      playerName: req.body.playerName,
      playerTeam: req.body.playerTeam,
      role: req.body.role,
      playerStatus: req.body.playerStatus,
    });
    newPlayer.save();
    log(newPlayer);
    res.status(200).send(newPlayer);
  } catch {
    res.send(Error);
  }
});

//update any one data in collection
app.patch("/api/update/:id", async (req, res) => {
  const { id } = req.params;

  const { playerName, playerTeam, role } = req.body;
  try {
    const EditPlayer = await Player.findByIdAndUpdate(
      { _id: id },
      {
        playerName: playerName,
        playerTeam: playerTeam,
        role: role,
      },
      { overwrite: true }
    );

    res.send(EditPlayer);
  } catch {
    res.send(Error);
  }
});

//delete one data of collection
app.delete("/api/delete/:_id", async (req, res) => {
  try {
    const result = await Player.deleteOne({ _id: req.params._id });
    res.send(result);
  } catch {
    res.send(Error);
  }
});

app.get("/api/get", SearchPaginatedResults(), (req, res) => {
  //             const filters = req.query.role;
  //             const filteredUsers = results.filter(results => {
  //                 let isValid = true;
  //                 for (key in filters) {
  //                     console.(key, results[key], filters[key]);
  //                     isValid = isValid && results[key] == filters[key];
  //                 }
  //                 return isValid;
  //             });
  //             res.send(filteredUsers);
  res.json(res.Results);
});

//read api with search and pagination
function SearchPaginatedResults() {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skipIndex = (page - 1) * limit;
    const results = {};
    const teamName = req.query.playerTeam;
    try {
      if (!teamName & !page & !limit) {
        results.count = await Player.countDocuments();
        results.results = await Player.find().sort({ _id: 1 }).exec();
        res.Results = results;
        next();
      } else if (!teamName) {
        results.count = await Player.countDocuments();
        results.totalPage = await Math.ceil(results.count / limit);
        results.results = await Player.find()
          .sort({ _id: -1 })
          .limit(limit)
          .skip(skipIndex)
          .exec();
        res.Results = results;
        next();
      } else {
        results.count = await Player.countDocuments({ playerTeam: teamName });
        results.totalPage = await Math.ceil(results.count / limit);
        results.results = await Player.find({ playerTeam: teamName })
          .sort({ _id: -1 })
          .limit(limit)
          .skip(skipIndex)
          .exec();
        res.Results = results;
        next();
      }
    } catch (e) {
      res.status(500).json({ message: "Error occur" });
    }
  };
}

app.listen(5000, () => {
  console.log("server is running at 5000");
});
