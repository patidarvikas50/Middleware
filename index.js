const express = require("express");
const app = express();
const users = require("./MOCK_DATA.json");
const PORT = 8001;
const fs = require("fs");

// Middleware
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n ${Date.now()} ${req.ip} ${req.method} ${req.path}`,
    (err, data) => {
      next();
    }
  );
});

app.use((req, res, next) => {
  console.log("Hello from Middleware 1");
  //    return res.end("Hey 1");
  req.myUserName = "Vikas04";
  next();
});

app.use((req, res, next) => {
  console.log("Hello from Middleware 2", req.myUserName);
  //    return res.json({msg: "Hello from Middleware 2"});
  next();
});

app.route("/api/users/:id")
.get((req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  console.log("user is --==>> ", user);
  return res.json(user);
});

app.post("/api/users", (req, res) => {
  const body = req.body;
  const newUser = users.push({ ...body, id: users.length + 1 });
  console.log("body", body);
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    if (err) {
      return res
        .status(505)
        .json({ status: "Error", message: "Failed to Add user" });
    }
    {
      return res.json({ status: "Success", user: newUser, id: users.length });
    }
  });
});

app.get("/users", (req, res) => {
  const body = req.body;
  const html = `<ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
  return res.send(html);
});

app.listen(PORT, console.log("Server Started Port:", PORT));
