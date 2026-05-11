(async () => {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyBEP3ktozz_9NT04bw-T15yoc_IjKKuBkg");
  const data = await res.json();
  console.log(data.models.map(m => m.name));
})();
