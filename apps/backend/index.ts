import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = Number(process.env.PORT) || 4000;

await connectDB();

createApp().listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
