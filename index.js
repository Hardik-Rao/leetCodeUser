import express from 'express';  // Import express
import axios from 'axios';  // Import axios

const app = express();  // Initialize the express app
const port = 3000;  // Define the port

// Set up static files and view engine
app.use(express.static("public"));  // Serve static files from the "public" folder
app.set('view engine', 'ejs');  // Set EJS as the templating engine

// Endpoint to render the homepage
app.get("/", (req, res) => {
    res.render('index');  // Assuming you have an index.ejs file
});

// Endpoint to get user profile details
app.get("/userProfile", async (req, res) => {
    const username = req.query.username;  // Use query parameter

    if (!username) {
        return res.status(400).send("Username is required");
    }

    try {
        // Fetch user profile data
        const profileResponse = await axios.get(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
        const profileData = profileResponse.data;
        console.log("Profile Data:", profileData);  // Log profile data

        // Fetch problems solved data
        const solvedResponse = await axios.get(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
        const problemsSolved = solvedResponse.data;
        console.log("Problems Solved Data:", problemsSolved);  // Log problems solved data

        // Fetch contest information
        const contestResponse = await axios.get(`https://alfa-leetcode-api.onrender.com/${username}/contest`);
        const contestInfo = contestResponse.data;
        console.log("Contest Info Data:", contestInfo);  // Log contest info data

        // Fetch badges (if any)
        // Fetch badges (if any)
const badgesResponse = await axios.get(`https://alfa-leetcode-api.onrender.com/${username}/badges`);
const badgesData = badgesResponse.data;
console.log("Badges Data:", badgesData);  // Log badges data

// Preparing the data to be passed to the EJS template
res.render('user', {
    ranking: profileData.ranking || 'N/A',  // Global ranking
    contestRating: contestInfo.contestRating || 'N/A',  // Contest ranking
    problemsSolved: problemsSolved.solvedProblem || 'Data not available',  // Total problems solved
    totalSubmissions: profileData.totalSubmissions[0].submissions || 'Data not available',  // Total submissions
    contestrating: contestInfo.contestRating || 'N/A',
    badges: badgesData.badges.length ? badgesData.badges : null,  // Pass the badges array or null if empty
    badgesCount: badgesData.badgesCount || 0  // Pass the count of badges
});

        
    } catch (error) {
        console.error("Error fetching LeetCode user data:", error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).send("Error fetching LeetCode user data");
    }
});

// Endpoint to get user badges
app.get('/:username/badges', async (req, res) => {
    const username = req.params.username;  // Use route parameter

    try {
        // Fetch badges data
        const badgesResponse = await axios.get(`https://alfa-leetcode-api.onrender.com/${username}/badges`);
        const badges = badgesResponse.data;
        console.log("Badges Data:", badges);  // Log badges data

        // Send badges data as response
        res.json(badges);
    } catch (error) {
        console.error("Error fetching badges data:", error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).send("Error fetching badges data");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
