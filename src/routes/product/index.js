"use strict";
const express = require("express");
const productController = require("../../controllers/product.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.get("/attributes", asyncHandler(productController.getProductAttributes));
router.get("/filter", asyncHandler(productController.filterProducts));
router.get("/search/:keywords", asyncHandler(productController.searchProducts));
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:productId", asyncHandler(productController.findOneProduct));

//need authentication
router.use(authentication);

//post
router.post("", [
  // upload.single("thumb"),
  upload.any(),
  asyncHandler(productController.createProduct),
]);
router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unpublishProductByShop)
);

//patch
router.patch("/:productId", asyncHandler(productController.updateProduct));

//get
router.get("/drafts/all", asyncHandler(productController.findAllDraftForShop));
router.get(
  "/published/all",
  asyncHandler(productController.findAllPublishForShop)
);

module.exports = router;
