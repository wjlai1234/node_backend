import express from "express";
import bodyParser from "body-parser";
import request from "request";

// import usersRoutes from "./routes/users.js";

const app = express();
const PORT = 5000;
var newData = {};
newData["data"] = [];
request(
  "https://jsonplaceholder.typicode.com/posts",
  function (error, response, body) {
    for (var key in JSON.parse(body)) {
      newData["data"].push({
        post_id: JSON.parse(body)[key].id,
        post_title: JSON.parse(body)[key].title,
        post_body: JSON.parse(body)[key].body,
        total_number_of_comments: 1,
      });
    }
  }
);
newData["length"] = newData["data"].length;
request(
  "https://jsonplaceholder.typicode.com/comments",
  function (error, response, body) {
    var count = 0; // Print the response status code if a response was received
    for (var i in newData["data"]) {
      for (var j in JSON.parse(body)) {
        if (JSON.parse(body)[j].postId == newData["data"][i].post_id) {
          count += 1;
        }
      }
      newData["data"][i].total_number_of_comments = count;
    }
  }
);
app.get("/", (req, res) => res.send(newData));
// -------------------------------Q2---------------------------------------------

app.get("/search", (req, res) => {
  request(
    "https://jsonplaceholder.typicode.com/comments",
    function (error, response, body) {
      // console.error("query:", req.query); // Print the error if one occurred
      // console.error("error:", error); // Print the error if one occurred
      //   console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      //   console.log("body:", JSON.parse(body)[0]); // Print the response status code if a response was received

      const filters = req.query;
      const filteredUsers = JSON.parse(body).filter((comment) => {
        let isValid = true;
        for (var key in filters) {
          //   console.log(key, comment[key], filters[key]);
          isValid = isValid && comment[key] == filters[key];
        }
        return isValid;
      });
      res.send(filteredUsers);
    }
  );
});
app.use(bodyParser.json());

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
