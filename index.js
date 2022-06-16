import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/*
Usuario global -> um usuario é um objeto com a estrutura:
{
    username: String,
    avatar: String(url)
}
*/
const _user = {};

/*
Tweets global -> um tweet é um objeto com a estrutura:
{
    username: String,
    tweet: String,
}
*/
const tweets = [];


//validar campo
function isValid(param) {
    if (param == "" || param == null) {
        return false;
    }
    return true;
}

//Auth
app.post("/sign-up", (req, res) => {
    if (isValid(req.body['username']) || isValid(req.body['avatar'])) {
        res.status(400).send("Todos os dados são obrigatórios");
    } else {
        _user.name = req.body['username'];
        _user.avatar = req.body['avatar'];

        res.status(201).send("Ok");
    }
});


//Tweets
app.post("/tweets", (req, res) => {
    if (isValid(req.body['username']) || isValid(req.body['tweet'])) {
        const tweet = {
            username: req.body['username'],
            tweet: req.body['tweet']
        };
        tweets.push(tweet);
        res.status(201).send("Ok");
    } else {
        res.status(400).send("Todos os dados são obrigatórios");
    }
});


app.get("/tweets", (_, res) => {
    if (tweets.length >= 10) {
        res.send(tweets.slice(tweets.length - 10));
    } else {
        res.send(tweets);
    }
});




app.listen(5000);