import app from "./app.js";

const PORT = Number(process.env.PORT) || 5009;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
