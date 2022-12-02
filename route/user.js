const express = require("express");
const router = express.Router();
const path = require("path");
const { validationResult } = require("express-validator");
const { userLoginValidation } = require("../class/validator");
const { userRegistrationValidation } = require(path.resolve(
  "class",
  "validator"
));
const Foods = require(path.resolve("class", "Foods"));
const User = require(path.resolve("class", "User"));

const food = new Foods();

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/menu", (req, res) => {
  res.render("menu");
});
router.get("/about", (req, res) => {
  res.render("about");
});
router.post("/category", async (req, res) => {
  res.json(await food.getAllCategories());
});

router.post("/allfoods", async (req, res) => {
  res.json(await food.getAllFoods());
});

router.post("/update_quantity/:id/:num", async (req, res) => {
  res.json(await food.updateQuantity(req.params.id, req.params.num));
});

router.post("/foods/:cat", async (req, res) => {
  res.json(await food.getSpecificFoods(req.params.cat));
});

router.post("/add_to_cart/:id", async (req, res) => {
  res.json(await food.addToCart(req.params.id));
});

router.post("/delete_from_cart/:id", async (req, res) => {
  res.json(await food.deleteFromCart(req.params.id));
});

router.post("/food_detail/:id", async (req, res) => {
  res.json(await food.getFoodDetail(req.params.id));
});

router.post("/in_cart", async (req, res) => {
  res.json(await food.getFoodsInCart());
});

router.post("/number_in_cart", async (req, res) => {
  res.json(await food.getTotalNumberOfFoodsIncart());
});

router.post("/register", userRegistrationValidation(), async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    res.json({ errors: validationResult(req).errors });
    return;
  }
  const user = new User(req.body);
  const emailExists = await user.checkIfExists("email", req.body.email);
  if (emailExists > 0) {
    res.json({
      errors: [
        {
          msg: "Email Already Exists",
          param: "email",
        },
      ],
    });
    return;
  }
  user.saveUser();
  res.json({ status: "success" });
});

router.post("/login", userLoginValidation(), async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    res.json({ errors: validationResult(req).errors });
    return;
  }
  const user = new User(req.body);
  let detail = await user.getUser();
  let field = [];
  for (data in req.body) {
    field.push(data);
  }
  if (detail.length == 0 || detail[0].password !== req.body.password) {
    let response = {
      error: "Invalid Username or Password",
      field: `${field}`,
    };
    res.json(response);
    return;
  }
  res.json({ success: true });
});

module.exports = router;
