var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var app = express();
var port = 3000;
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

var mongoose = require("mongoose");

var db = mongoose
  .connect(process.env.MONGODB_URL)
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// 스키마 등록
const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);
var usersModel = mongoose.model("users", usersSchema);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

/*
app.get("/serach",(req,res)=>{

})
*/

// 데이터 추가1
app.get("/add_1", (req, res) => {
  newUsers = new usersModel();
  newUsers.username = "cocoon";
  newUsers.password = "asd123";
  newUsers.age = 27;
  newUsers.save((err) => {
    if (err) throw err;
    console.log("Add Success!");
    res.send("Add Success!");
  });
});

// 데이터 추가2
app.get("/add_2", (req, res) => {
  usersModel.create(
    {
      username: "ultra",
      password: "zxc321",
      age: 27,
    },
    (err) => {
      if (err) throw err;
      console.log("Add Success!");
      res.send("Add Success!");
    }
  );
});

// 데이터 추가3
app.get("/add_3", (req, res) => {
  usersModel.create(
    {
      username: "zeze",
      password: "qwe582",
      age: 29,
    },
    (err) => {
      if (err) throw err;
      console.log("Add Success!");
      res.send("Add Success!");
    }
  );
});

// 데이터 검색
app.get("/search", (req, res) => {
  usersModel.find(
    {
      age: 27,
    },
    (err, items) => {
      if (err) throw err;
      console.log(items);
      console.log("Search Success!");
      res.send("Search Success!");
    }
  );
});

// 데이터 갱신
app.get("/update", (req, res) => {
  usersModel.findOne(
    {
      username: "cocoon",
    },
    (err, item) => {
      if (err) throw err;
      item.updateOne(
        {
          password: "ppp111",
        },
        (err) => {
          if (err) throw err;
          console.log("Update Success!");
          res.send("Update Success!");
        }
      );
    }
  );
});

// 데이터 삭제
app.get("/delete", (req, res) => {
  usersModel.findOne(
    {
      username: "cocoon",
    },
    (err, item) => {
      if (err) throw err;
      item.remove((err) => {
        if (err) throw err;
        console.log("Delete Success!");
        res.send("Delete Success!");
      });
    }
  );
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => {
  console.log(`Server is running, port(${port})`);
});

module.exports = app;
