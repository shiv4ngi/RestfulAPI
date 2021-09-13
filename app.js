import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/springBootDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  birthdate: String,
  gender: String,
  address: String,
  email: String,
  phone: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.send("Hello! Welcome to my Project");
});

app
  .route("users")

  .get(function (req, res) {
    User.find(function (err, foundUsers) {
      if (!err) {
        res.send(foundUsers);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    const newUser = new User({
      name: req.body.name,
      birthdate: req.body.birthdate,
      gender: req.body.gender,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
    });

    newUser.save(function (err) {
      if (!err) {
        res.send("Successfully added a new User");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/users/:userName")

  .get(function (req, res) {
    User.findOne({ name: req.params.userName }, function (err, foundUser) {
      if (foundUser) {
        res.send(foundUser);
      } else {
        res.send("Requested User does not exist");
      }
    });
  })

  .put(function (req, res) {
    User.updateOne(
      { name: req.params.userName },
      {
        name: req.body.name,
        birthdate: req.body.birthdate,
        gender: req.body.gender,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
      },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Successfully updated the user.");
        }
      }
    );
  })

  .patch(function (req, res) {
    User.updateOne(
      { name: req.params.userName },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated the user");
        }
      }
    );
  })

  .delete(function (req, res) {
    User.deleteOne({ name: req.params.userName }, function (err) {
      if (!err) {
        res.send("Successfully deleted the User");
      }
    });
  });

app.listen(3000, function () {
  console.log("Server stared on port 3000");
});
