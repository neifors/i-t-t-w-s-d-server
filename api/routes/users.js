const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");

const userController = require("../controllers/user");

router.get("/", verifyToken, userController.index);
router.get("/:username", verifyToken, userController.findByUsername);
router.patch("/:username", verifyToken, userController.updatePassword);

module.exports = router;
