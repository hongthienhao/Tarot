const fetch = require('node-fetch'); // or built-in fetch
(async () => {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBEP3ktozz_9NT04bw-T15yoc_IjKKuBkg", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
  });
  const data = await res.json();
  console.log(data);
})();
