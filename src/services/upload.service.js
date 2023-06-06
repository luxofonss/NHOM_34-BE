const express = require("express");
const { initializeApp } = require("firebase/app");
const { FIREBASE_CONFIGURATION } = require("../constant");
const { ErrorResponse } = require("../core/error.response");
const getCurrentDataTime = require("../utils/getCurrentDateTime");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const multer = require("multer");

const router = express.Router();

//Initialize a firebase application
initializeApp(FIREBASE_CONFIGURATION);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

class UploadService {
  static uploadSingleImage = async (file) => {
    try {
      const dateTime = getCurrentDataTime();
      const storageRef = ref(
        storage,
        `files/images/${file.originalname + " " + dateTime}`
      );
      const metadata = {
        contentType: file.mimetype,
      };

      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // Grab the public url
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("File successfully uploaded.");
      return downloadURL;
    } catch (error) {
      throw new ErrorResponse("Sorry, something went wrong!");
    }
  };
}

// router.post("/", upload.single("filename"), async (req, res) => {
//   try {
//     // Create file metadata including the content type
//   } catch (error) {
//     return res.status(400).send(error.message);
//   }
// });

module.exports = UploadService;
