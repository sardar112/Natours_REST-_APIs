const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./index');

dotenv.config({ path: './Config.env' });

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected successfully'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server running on port ${port} ...`);
});
