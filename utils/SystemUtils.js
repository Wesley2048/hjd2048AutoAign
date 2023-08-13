const fs = require("fs");
const axios = require("axios");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function readFileToBase64(filePath) {
  try {
    const fileData = fs.readFileSync(filePath);
    return fileData.toString("base64");
  } catch (error) {
    console.error("读取文件错误:", error);
    return null;
  }
}

async function getVerifyPosition(src, target) {
  let data = await axios.request({
    method: "POST",
    baseURL: "http://127.0.0.1:9991/slideMatch",
    data: {
      slider: target.replace("data:image/png;base64,", ""),
      background: src.replace("data:image/png;base64,", ""),
    },
    timeout: 3000,
  });
  return data.data.distance;
}

module.exports = {
  sleep,
  readFileToBase64,
  getVerifyPosition,
};