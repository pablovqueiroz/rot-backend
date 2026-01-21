const express = require("express");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/image",upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Image not sent" });
  }

  return res.status(201).json({
    url: req.file.path,          
    public_id: req.file.filename 
  });
});

module.exports = router;
