const fetch = require("node-fetch");

module.exports.get = get = async (url) => {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch(e) {
    return { success: false, error: e };
  }
} 

module.exports = get;