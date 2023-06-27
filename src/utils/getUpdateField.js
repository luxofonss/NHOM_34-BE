"use strict";

const convertObject = (value, name) => {
  const obj = {};
  obj[name] = value;
  return obj;
};

function getUpdateField(obj, parentKey = "") {
  console.log("obj:: ", obj);
  console.log(Array.isArray(obj["address"]));
  let result = {};
  for (const key in obj) {
    // Check if the value is an object
    if (Array.isArray(obj[key])) {
      // Loop through the array and call the function recursively on each element
      obj[key].forEach((element, index) => {
        console.log(element);
        Object.assign(result, { $push: { [key]: element } });
      });
    } else if (typeof obj[key] === "object") {
      // Call the function recursively to convert the nested object
      // Pass the parent key as an argument to append it to the nested keys
      console.log("obj[key]:: ", obj[key]);
      console.log(`${parentKey ? `${parentKey}.` : ""}${key}`);
      Object.assign(
        result,
        convertObject(obj[key], `${parentKey ? `${parentKey}.` : ""}${key}`)
      );
    } else {
      // Add the key to the result object with the same value
      // Use the parent key to create the full key in the format key1.key2.key3...
      result[`${parentKey ? `${parentKey}.` : ""}${key}`] = obj[key];
    }
  }
  return result;
}

module.exports = getUpdateField;
