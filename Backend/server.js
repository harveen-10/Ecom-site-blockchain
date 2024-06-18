import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = 3000;
const saltRounds = 10;

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET, POST",
    credentials: true
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))


const db = new pg.Client({
    user: process.env.USER,
    host: "localhost",
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432,
});
db.connect();


app.get("/home", async(req, res) => {
    try {
        const products = await db.query("SELECT name, price, img FROM items");
        res.send({products});
    } catch (error) {
        console.error("Error fetching products:", error);
    } 
});

app.get("/cart", async(req, res) => {
    const email=req.query.email;
    
    try{
        const result = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
        if(result.rows.length==0){
            console.log("email doesnt exist in database");
        }else{
            const userid=result.rows[0].id;
            const cart= await db.query("SELECT * from checkout WHERE user_id = $1", [userid]);
            res.send(cart);
        }

    }catch(err){
        console.error(err);
    }
});


app.post("/signup", async (req, res) => {
    const email=req.body.email;
    const name=req.body.name;
    const password=req.body.password;

    if (!email) {
        return res.status(400).send("Email is required");
    }

    try{
        const check=await db.query("SELECT * FROM users WHERE email = $1;", [email]);

        if(check.rows.length>0){
            res.send("This email already exists. Try logging in.");
        } else{
            bcrypt.hash(password, saltRounds, async(err, hash)=>{
                if(err){
                    console.log("Error hashing password ", err);
                } else{
                    await db.query("INSERT INTO users (email, name, password) VALUES ($1, $2, $3);", [email, name, hash]);
                }
                return res.send("successful");
            })
        }

    }catch(err){
        console.error("Error: ", err);
    }
});


app.post("/login", async (req, res) => {
    const email=req.body.email;
    const password=req.body.password;

    if (!email) {
        return res.status(400).send("Email is required");
    }

    try{
        const result=await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if(result.rows.length > 0){
            const passwordStored=result.rows[0].password;

            bcrypt.compare(password, passwordStored, async(err, result)=>{
                if(err){
                    console.log("Error hashing password ", err);
                }
                else{                
                    if(result){
                        res.send("successful");
                    }else{
                        res.send("Incorrect password");
                    }
                }
            });


        } else{
            res.send("User not found");
        }
    }catch(err){
        console.log(err);
    }
});


app.post("/home", async (req, res) => {
    const email=req.body.email;
    const item=req.body.item;
    const price=req.body.price;
    const quantity=req.body.quantity;

    try{
        const result = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
        if(result.rows.length==0){
            console.log("email doesnt exist in database");
        }else{
            const userid=result.rows[0].id;
            await db.query("INSERT INTO checkout (item, price, quantity, user_id) VALUES ($1, $2, $3, $4)", [item, price, quantity, userid]);
        }

    }catch(err){
        console.log(err);
    }
});


app.post("/checkout", async (req, res) => {
    const email=req.body.email;

    try{
        const userdata = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
        if(userdata.rows.length==0){
            res.send("email doesnt exist in database");
        }else{
            const userid=userdata.rows[0].id;
            const result=await db.query("SELECT * FROM checkout WHERE user_id = $1", [userid]);
            if(result.rows.length==0){
                res.send("Checkout cart is empty");
            }else{
                await db.query("DELETE FROM checkout WHERE user_id = $1", [userid]);
                res.send("Successfully deleted");
            }
        }
    }catch(err){
        console.error(err);
    }
});


app.post("/change", async (req, res) => {
    const email=req.body.email;
    const item=req.body.item;
    const newquantity=req.body.quantity;
    const price=req.body.price;

    try{
        const userdata = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
        if(userdata.rows.length==0){
            console.log("email doesnt exist in database");
        }else{
            const userid=userdata.rows[0].id;
            const result=await db.query("SELECT * FROM checkout WHERE user_id = $1 AND item = $2", [userid, item]);
            if(result.rows.length==0){
                await db.query("INSERT INTO checkout (item, price, quantity, user_id) VALUES ($1, $2, $3, $4)", [item, price, newquantity, userid]);
                res.send("successfully added");
            }else{
                if(newquantity==0){
                    await db.query("DELETE FROM checkout WHERE user_id = $1 AND item = $2", [userid, item]);
                    res.send("successfully removed");
                }
                else{
                    await db.query("UPDATE checkout SET quantity = $1 WHERE user_id = $2 AND item = $3", [newquantity, userid, item]);
                    res.send("successfully updated");
                }
            }
        }
    }catch(err){
        console.error(err);
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });