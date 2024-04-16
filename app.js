const express = require('express');
const app = express();
const port = 3000;
const path = require ('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session')
const loginFile = path.join(__dirname, 'public', 'login_file.txt');
const availablePetInfoFile = path.join(__dirname, 'public', 'available_pet_info_file.txt');

// id counter for pet give away form:
let id_counter = 1;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

// Set up session middleware
app.use(session({
    secret: 'little paws', // Choose a strong secret for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set true if you're using HTTPS
}));

// Middleware for parsing data
app.use(express.urlencoded({ extended: true }));

// Middleware to parse the body of the request
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    // Use res.render to return the home_page HTML file.
    res.render("home_page", {});
});

app.get('/home_page', (req, res) => {
    // Use res.render to return the home_page HTML file.
    res.render("home_page", {});
});

app.get('/create_account', (req, res) => {
    res.render('create_account', { message: '' }); // Render with an empty message initially
});

app.get('/pets', (req, res) => {
    // Use res.render to return the pets HTML file.
    res.render("pets", {});
});

app.get('/cat_care', (req, res) => {
    // Use res.render to return the cat_care HTML file.
    res.render("cat_care", {});
});

app.get('/dog_care', (req, res) => {
    // Use res.render to return the dog_care HTML file.
    res.render("dog_care", {});
});

app.get('/contact_us', (req, res) => {
    // Use res.render to return the contact_us HTML file.
    res.render("contact_us", {});
});

app.get('/find_pet', (req, res) => {
    // Use res.render to return the find_pet HTML file.
    res.render("find_pet", {});
});

app.get('/find_dog', (req, res) => {
    // Use res.render to return the find_dog HTML file.
    res.render("find_dog", {});
});

app.get('/find_cat', (req, res) => {
    // Use res.render to return the find_cat HTML file.
    res.render("find_cat", {});
});

app.get('/give_away', (req, res) => {    // add require login
    // Use res.render to return the give_away HTML file.
    res.render("give_away", {});
})

app.get('/give_away_dog', (req, res) => {
    // Use res.render to return the give_away_dog HTML file.
    res.render("give_away_dog", {});
})

app.get('/give_away_cat', (req, res) => {
    // Use res.render to return the give_away_cat HTML file.
    res.render("give_away_cat", {});
})

app.get('/give_away_done', (req, res) => {
    // Use res.render to return the give_away_done HTML file.
    res.render("give_away_done", {});
})

// Route to handle login page and check session
app.get('/log_in', (req, res) => {
    if (req.session.isLoggedIn) {
        console.log('already logged in');
        res.render("give_away", {});
    } else {
        console.log('not logged in');
        res.render("log_in", {});
    }
});

app.get('/log_out', (req, res) => {
    // Use res.render to return the log_out HTML file.
    res.render("log_out", { message: '' });
});

app.get('/privacy_and_disclamer_statement', (req, res) => {
    // Use res.render to return the privacy_and_disclamer_statement HTML file.
    res.render("privacy_and_disclamer_statement", {});
});

// Helper function to check if username and password are valid
function isValidUsername(username) {
    return /^[A-Za-z0-9]+$/.test(username);
}

function isValidPassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/.test(password);
}

// Function to check if username already exists
function usernameExists(username, callback) {
    fs.readFile(loginFile, 'utf8', (err, data) => {
        if (err) {
            return callback(err);
        }
        const lines = data.split('\n');
        const exists = lines.some(line => line.split(':')[0] === username);
        callback(null, exists);
    });
}

// Route to handle account creation
app.post('/create_account', (req, res) => {
    const { username, password } = req.body;

    if (!isValidUsername(username) || !isValidPassword(password)) {
        console.log("Invalid username or password format. Please try again.");
        return res.send('<script>alert("Invalid username or password format. Please try again."); window.history.back();</script>');
    }

    usernameExists(username, (err, exists) => {
        if (err) {
            console.log("Error reading user data.");
            return res.send('<script>alert("Error reading user data."); window.history.back();</script>');
        }
        if (exists) {
            console.log("Username already exists, please choose another one.");
            return res.send('<script>alert("Username already exists, please choose another one."); window.history.back();</script>');
        }

        // Append new username and password to file
        fs.appendFile(loginFile, `${username}:${password}\n`, (err) => {
            if (err) {
                console.log("Failed to create account.");
                return res.send('<script>alert("Failed to create account."); window.history.back();</script>');
            }
            console.log("Account successfully created. You are now ready to login.");
            res.render('create_account', { message: 'Account successfully created. You are now ready to login.' });
        });
    });
});


// Function animalGiveAway
function animalGiveAway(animal, breed, age, gender, other_dogs, other_cats, small_children, comment, username, email){
    const dataParts = [id_counter, username, animal, breed, age, gender, other_dogs, other_cats, small_children, comment, email];
    let info = dataParts.join(':') + "\n";
    id_counter++;
    return info;
}

// Utility function to check if all required fields are filled
function validateFields(fields) {
    return fields.some(field => field === undefined || field.trim() === '');
}

// Utility function to match criteria
function criteriaMatch(criteria, value) {
    return criteria.toLowerCase() === value.toLowerCase();
}

// Used to return the values capitalized at their first character in available_dogs.ejs or available_cats.ejs
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Function to return descriptive sentences about dog and cat ages in available_dog.ejs and available_dog.ejs files
function formatAge(age) {
    const ageMap = {
        "0.1/2": "Less than 6 months",
        "1/2.1": "Between 6 and 12 months",
        "1.3": "Between 1 and 3 years",
        "4.7": "Between 4 and 7 years",
        "8.10": "Between 8 and 10 years",
        "11.14": "Between 11 and 14 years",
        "14": "More than 14 years"
    };
    return ageMap[age] || age; // Return the mapped age description or the original value if no mapping exists
}

// app.post /find_dog
app.post('/find_dog', (req, res) => {
    console.log("Find a dog form.");
    let {dog_breed2, dog_age2, dog_gender2, dog_other_dogs2, dog_other_cats2, dog_small_children2} = req.body;

    if (validateFields([dog_breed2, dog_age2])) {
        console.error("Validation failed: Missing required fields.");
        return res.send('<script>alert("Please fill out all required fields."); window.history.back();</script>');
    }

    fs.readFile(availablePetInfoFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file: ", err);
            return res.send('<script>alert("Error reading file."); window.history.back();</script>');
        }

        const lines = data.trim().split('\n');
        const matches = lines.filter(line => {
            const parts = line.split(':');
            return parts[2].trim() === 'dog' && (
                (dog_breed2 === "doesn't matter choice" || criteriaMatch(dog_breed2, parts[3].trim())) &&
                (dog_age2 === "doesn't matter choice" || criteriaMatch(dog_age2, parts[4].trim())) &&
                (dog_gender2 === "doesn't matter choice" || criteriaMatch(dog_gender2, parts[5].trim())) &&
                (dog_other_dogs2 === "doesn't matter choice" || criteriaMatch(dog_other_dogs2, parts[6].trim())) &&
                (dog_other_cats2 === "doesn't matter choice" || criteriaMatch(dog_other_cats2, parts[7].trim())) &&
                (dog_small_children2 === "doesn't matter choice" || criteriaMatch(dog_small_children2, parts[8].trim()))
            );
        }).map(line => {
            const parts = line.split(':');
            return {
                breed: capitalizeFirstLetter(parts[3]),
                age: formatAge(parts[4]),
                gender: capitalizeFirstLetter(parts[5]),
                otherDogs: capitalizeFirstLetter(parts[6]),
                otherCats: capitalizeFirstLetter(parts[7]),
                smallChildren: capitalizeFirstLetter(parts[8])
            };
        });

        if (matches.length > 0) {
            console.log("Matching dogs found.");
            res.render('available_dogs', { dogs: matches });
        } else {
            console.log("No matching dogs found.");
            return res.send('<script>alert("No matching dogs found. Please modify your search criteria."); window.history.back();</script>');
        }
    });
});

// app.post /find_cat
app.post('/find_cat', (req, res) => {
    console.log("Find a cat form.");
    let {cat_breed2, cat_age2, cat_gender2, cat_other_dogs2, cat_other_cats2, cat_small_children2} = req.body;

    if (validateFields([cat_breed2, cat_age2])) {
        console.error("Validation failed: Missing required fields.");
        return res.send('<script>alert("Please fill out all required fields."); window.history.back();</script>');
    }

    fs.readFile(availablePetInfoFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file: ", err);
            return res.send('<script>alert("Error reading file."); window.history.back();</script>');
        }

        const lines = data.trim().split('\n');
        const matches = lines.filter(line => {
            const parts = line.split(':');
            return parts[2].trim() === 'cat' && (
                (cat_breed2 === "doesn't matter choice" || criteriaMatch(cat_breed2, parts[3].trim())) &&
                (cat_age2 === "doesn't matter choice" || criteriaMatch(cat_age2, parts[4].trim())) &&
                (cat_gender2 === "doesn't matter choice" || criteriaMatch(cat_gender2, parts[5].trim())) &&
                (cat_other_dogs2 === "doesn't matter choice" || criteriaMatch(cat_other_dogs2, parts[6].trim())) &&
                (cat_other_cats2 === "doesn't matter choice" || criteriaMatch(cat_other_cats2, parts[7].trim())) &&
                (cat_small_children2 === "doesn't matter choice" || criteriaMatch(cat_small_children2, parts[8].trim()))
            );
        }).map(line => {
            const parts = line.split(':');
            return {
                breed: capitalizeFirstLetter(parts[3]),
                age: formatAge(parts[4]),
                gender: capitalizeFirstLetter(parts[5]),
                otherDogs: capitalizeFirstLetter(parts[6]),
                otherCats: capitalizeFirstLetter(parts[7]),
                smallChildren: capitalizeFirstLetter(parts[8])
            };
        });

        if (matches.length > 0) {
            console.log("Matching cats found.");
            res.render('available_cats', { cats: matches });
        } else {
            console.log("No matching cats found.");
            return res.send('<script>alert("No matching cats found. Please modify your search criteria."); window.history.back();</script>');
        }
    });
});

// app.get to display all available pets in available_pets.ejs file
app.get('/available_pets', (req, res) => {
    fs.readFile(availablePetInfoFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.send('<script>alert("Error reading pet file"); window.history.back();</script>');
        }

        const pets = data.trim().split('\n').map(line => {
            const parts = line.split(':');
            if (parts.length > 8) { // Ensure there are enough parts in the line
                return {
                    pet: capitalizeFirstLetter(parts[2]),
                    breed: capitalizeFirstLetter(parts[3]),
                    age: formatAge(parts[4]),
                    gender: capitalizeFirstLetter(parts[5]),
                    otherDogs: capitalizeFirstLetter(parts[6]),
                    otherCats: capitalizeFirstLetter(parts[7]),
                    smallChildren: capitalizeFirstLetter(parts[8])
                };
            }
            return null;
        }).filter(pet => pet !== null); // Filter out any null entries

        res.render('available_pets', { pets });
    });
});

// app.post /give_away_dog
app.post('/give_away_dog', (req, res) => {
    let {dog_breed1, dog_age1, dog_gender1, dog_other_dogs1, dog_other_cats1, dog_small_children1, dog_comment1, dog_username1, dog_email1} = req.body;

    // Check if any field is missing or empty
    if (validateFields([dog_breed1, dog_age1, dog_gender1, dog_other_dogs1, dog_other_cats1, dog_small_children1, dog_comment1, dog_username1, dog_email1])) {
        // If any field is missing, return to the current page and show alert message
        console.log('Please fill out all fields before submitting.');
        return res.send('<script>alert("Please fill out all fields before submitting."); window.history.back();</script>');
    }

    let line = animalGiveAway("dog", dog_breed1, dog_age1, dog_gender1, dog_other_dogs1, dog_other_cats1, dog_small_children1, dog_comment1, dog_username1, dog_email1);

    fs.appendFile(availablePetInfoFile, line, (err) => {
        if (err) {
            return res.send('An error occurred ' + err);
        }
        console.log("Writing to file path: ", availablePetInfoFile);
        console.log("Data to append:", line);
        console.log("Data received and processed.");
        res.redirect('/give_away_done');
    });
});

// app.post /give_away_cat
app.post('/give_away_cat', (req, res) => {
    let {cat_breed1, cat_age1, cat_gender1, cat_other_dogs1, cat_other_cats1, cat_small_children1, cat_comment1, cat_username1, cat_email1} = req.body;

    // Check if any field is missing or empty
    if (validateFields([cat_breed1, cat_age1, cat_gender1, cat_other_dogs1, cat_other_cats1, cat_small_children1, cat_comment1, cat_username1, cat_email1])) {
        // If any field is missing, return to the current page and show alert message
        console.log('Please fill out all fields before submitting.');
        return res.send('<script>alert("Please fill out all fields before submitting."); window.history.back();</script>');
    }

    let line = animalGiveAway("cat", cat_breed1, cat_age1, cat_gender1, cat_other_dogs1, cat_other_cats1, cat_small_children1, cat_comment1, cat_username1, cat_email1);

    fs.appendFile(availablePetInfoFile, line, (err) => {
        if (err) {
            return res.send('An error occurred ' + err);
        }
        console.log("Writing to file path: ", availablePetInfoFile);
        console.log("Data to append:", line);
        console.log("Data received and processed.");
        res.redirect('/give_away_done');
    });
});

// Route to handle account creation
app.post('/create_account', (req, res) => {
    const { username, password } = req.body;

    if (!isValidUsername(username) || !isValidPassword(password)) {
        console.log("Invalid username or password format. Please try again.");
        return res.send('<script>alert("Invalid username or password format. Please try again."); window.history.back();</script>');
    }

    usernameExists(username, (err, exists) => {
        if (err) {
            console.log("Error reading user data.");
            return res.send('<script>alert("Error reading user data."); window.history.back();</script>');
        }
        if (exists) {
            console.log("Username already exists, please choose another one.");
            return res.send('<script>alert("Username already exists, please choose another one."); window.history.back();</script>');
        }

        fs.appendFile(loginFile, `${username}:${password}\n`, (err) => {
            if (err) {
                console.log("Failed to create account.");
                return res.send('<script>alert("Failed to create account."); window.history.back();</script>');
            }
            console.log("Account successfully created! You are now ready to login.");
            console.log("Sending message to EJS:", 'Account successfully created! You are now ready to login.');
            res.render('create_account', { message : 'Account successfully created! You are now ready to login.' });
        });
    });
});

// Route to handle login verification
app.post('/log_in', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(loginFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Reading from login_file.txt file failed.");
            return res.send('<script>alert("Reading from login_file.txt file failed."); window.history.back();</script>');
        }

        const lines = data.trim().split('\n');
        const exists = lines.some(line => line === `${username}:${password}`);

        if (exists) {
            req.session.isLoggedIn = true; // Set the session as logged in
            res.render('give_away'); // Render the give away page if username and password match
        } else {
            res.send('<script>alert("Invalid username or password. Please try again."); window.history.back();</script>');
        }
    });
});

app.post('/log_out', (req, res) => {
    if (req.session.isLoggedIn) {
        req.session.destroy(err => {
            if (err) {
                console.error("Failed to destroy the session during logout.", err);
                return res.send('<script>alert("Error logging out. Please try again."); window.history.back();</script>');
            }

            console.log("You have been successfully logged out!");
            res.render('log_out', { message: "You have been successfully logged out!" });
        });
    } else {
        res.send('<script>alert("You are not logged in."); window.history.back();</script>');
    }
});
    
app.listen(port, ()=> {
    console.log(`Server running on port ${port}.`);
});