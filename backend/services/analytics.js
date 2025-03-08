const postAnalytics = async (events) => {
  const data = JSON.stringify({
    client_id: "simple-webstore-backend",
    events,
  });

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
    body: data,
  });
};

module.exports = { postAnalytics };
