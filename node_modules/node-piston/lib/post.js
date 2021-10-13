const fetch = require("node-fetch");

module.exports.post = post = async (url, body) => {
  try {
    const res = await fetch(url, { 
      method: 'POST',
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch(e) {
    return { success: false, error: e };
  }
}

module.exports = post;