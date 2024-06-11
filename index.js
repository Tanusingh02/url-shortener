const express = require("express");
const { connectToMongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const app = express();
const URL = require('./models/url')
const PORT = 8001;

// Corrected the port number in the MongoDB connection string
connectToMongoDB('mongodb://127.0.0.1:27017/short-url').then(() => {
    console.log("MongoDB connected");
}).catch(err => {
    console.error("Failed to connect to MongoDB", err);
});
app.use(express.json());
app.use("/url", urlRoute);

app.get('/:shortId', async(req,res)=>{
    const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
