const express = require('express');
const cors = require('cors');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes')

const app = express();
app.use(cors());
app.use(express.json());

app.use('/blogs', blogRoutes);
app.use('/blogs', authRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
