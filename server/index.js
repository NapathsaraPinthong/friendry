const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10; 

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "friendry_admin",
    host: "localhost",
    password: "admin1234",
    database: "friendry",
    port: '3306'
})

db.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL database =', err)
        return;
    }
    else {
        console.log('MySQL successfully connected');
    }
})

app.post('/signup', async (req, res) => {
    const { student_id, fname, lname, password } = req.body;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.log("Error while hashing the password");
            return res.status(500).send();
        }
        const sql = "INSERT INTO users (student_id, fname, lname, password) VALUES (?,?,?,?)";
        try {
            db.query(sql, [student_id, fname, lname, hash], (err, results, field) => {
                if (err) {
                    console.log("Error while inserting");
                    console.log(hash);

                    return res.status(400).send();
                }
                return res.status(201).json({ message: "inserted successfully" });
            })
        } catch (err) {
            console.log(err);
            return res.status(500).send();
        }
    });
});

app.get("/login/:id", async (req, res) => {
    const student_id = req.params.id;

    try {
        db.query("SELECT * FROM users WHERE student_id = ?", [student_id], (err, result, field) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ message: "Error" });
            }
            res.status(200).json(result);
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
})

//Host Page
app.get("/hosts", async (req, res) => {

    try {
        db.query(
            "SELECT hostID FROM activity",
            (err, results, feilds) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json(results);
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

//Create Activity page
app.post('/create-activity', async (req, res) => {
    const { name, category, capacity, description, location, equipment, hostID } = req.body;

    try {
        db.query(
            "INSERT INTO activity (name, category, capacity, description, location, equipment, hostID) VALUES(?,?,?,?,?,?,?)",
            [name, category, capacity, description, location, equipment, hostID],
            (err, results, fields) => {
                if (err) {
                    console.error('Error while inserting a activity into the database', err);
                    return res.status(400).send();
                } else {
                    return res.status(201).json({ message: "New activity succesfully created" })
                }
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

app.delete('/delete-activity/:activityID', async (req, res) => {
    const activityID = req.params.activityID;

    try {
        db.query(
            "DELETE FROM activity WHERE activityID = ?",
            [activityID],
            (err, results, fields) => {
                if (err) {
                    console.error('Error while deleting activity from the database', err);
                    return res.status(400).send();
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: "No activity with that ID" });
                }
                else {
                    return res.status(200).json({ message: "Activity deleted successfully" });
                }
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

app.patch('/update-activity/:activityID', async (req, res) => {
    const activityID = req.params.activityID;
    const { name, category, capacity, description, location, equipment } = req.body;

    try {
        db.query(
            "UPDATE activity SET name = ?, category = ?, capacity = ?, description = ?, location = ?, equipment= ? WHERE activityID = ?",
            [name, category, capacity, description, location, equipment, activityID],
            (err, results, fields) => {
                if (err) {
                    console.error('Error while updating activity', err);
                    return res.status(400).send();
                } else {
                    return res.status(201).json({ message: "Activity succesfully updated" })
                }
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});


app.get("/locations", async (req, res) => {
    try {
        db.query(
            "SELECT roomID, name FROM location WHERE status = 'available'",
            (err, results, feilds) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json(results);
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
})

app.get("/equipments", async (req, res) => {
    try {
        db.query(
            "SELECT code, name FROM equipment WHERE quantity > 0",
            (err, results, feilds) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json(results);
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});


app.patch("/location/reserve", async (req, res) => {
    const roomID = req.body.roomID;
    try {
        db.query(
            "UPDATE location SET status = 'unavailable' WHERE roomID = ?", [roomID],
            (err, results, feilds) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json({ message: "location has reserved succesfully" });
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

app.patch("/location/cancel", async (req, res) => {
    const roomID = req.body.roomID;
    try {
        db.query(
            "UPDATE location SET status = 'available' WHERE roomID = ?", [roomID],
            (err, results, feilds) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json({ message: "location has cancel succesfully" });
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

app.patch("/equipment/reserve", async (req, res) => {
    const code = req.body.code;
    try {
        db.query(
            "UPDATE equipment SET quantity = quantity-1 WHERE code = ?", [code],
            (err, results, feilds) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json({ message: "equipment has reserved succesfully" });
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

app.patch("/equipment/cancel", async (req, res) => {
    const code = req.body.code;
    try {
        db.query(
            "UPDATE equipment SET quantity = quantity+1 WHERE code = ?", [code],
            (err, results, feilds) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json({ message: "equipment has cancel succesfully" });
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});


//Host Management page
app.get("/host/activity/:id", async (req, res) => {

    const hostID = req.params.id;

    try {
        db.query(
            "SELECT a.activityID, a.name, a.description, a.category, a.capacity, l.roomID, l.name as room, l.address, e.code, e.name as equipment FROM activity a JOIN location l ON a.location = l.roomID JOIN equipment e ON a.equipment = e.code WHERE a.hostID = ?", [hostID],
            (err, results, feilds) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json(results);
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

app.get("/host/group/:id", async (req, res) => {

    const hostID = req.params.id;

    try {
        db.query(
            "SELECT u.student_id, u.fname, u.lname FROM users u JOIN activitygroup ag ON u.student_id = ag.studentID JOIN activity a ON a.activityID = ag.activityID WHERE a.hostID = ?", [hostID],
            (err, results, feilds) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json(results);
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});


//Activity List page
app.get("/activitylist", async (req, res) => {
    db.query(
        "SELECT a.activityID, a.name, a.category, a.capacity, a.description, a.location, l.name as RoomName, l.address, COUNT(*) as Current FROM activity a JOIN activitygroup g ON a.activityID = g.activityID JOIN location l ON l.roomID = a.location GROUP BY a.activityID;",
        (err, results) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(results);
            }
        });
});

app.get("/activitygroup/:id", async (req, res) => {

    const userID = req.params.id;

    db.query(
        "SELECT a.ActivityID, a.Name, a.Category, a.Capacity, a.Description, a.location, l.Name as RoomName, l.Address, COUNT(*) as Current FROM activity a JOIN activitygroup g ON a.ActivityID = g.ActivityID JOIN location l ON l.RoomID = a.location WHERE a.ActivityID IN (SELECT ActivityID from activitygroup WHERE StudentID = ?) GROUP BY a.ActivityID;", [userID],
        (err, results) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(results);
            }
        });
});

app.post("/join", async (req, res) => {
    const { activityID, userID } = req.body;
    try {
        db.query(
            "INSERT INTO activitygroup (studentID, activityID) VALUES(?,?)",
            [userID, activityID],
            (err, results, fields) => {
                if (err) {
                    console.error('Error while inserting a user into the database', err);
                    return res.status(400).send();
                } else {
                    return res.status(201).json({ message: "Join the activity succesfully" })
                }
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

//Join activity page
app.get("/activity/:id", async (req, res) => {

    const userID = req.params.id;

    try {
        db.query(
            "SELECT a.Name, a.Description, a.Category, a.Capacity, l.Name as Room, l.Address as Address, u.fname as HostFirstName, u.lname as HostLastName FROM activity a JOIN location l ON a.location = l.RoomID JOIN activitygroup g ON g.ActivityID = a.ActivityID JOIN users u ON u.student_id = a.HostID WHERE g.StudentID = ?", [userID],
            (err, results, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json(results);
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

app.delete("/leave/:id", async (req, res) => {

    const userID = req.params.id;
    try {
        db.query(
            "DELETE FROM activitygroup WHERE StudentID = ?", [userID],
            (err, results, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: "Error leaving activity" });
                }
                res.status(200).json(results);
            })
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
})