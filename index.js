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
const _users = [];

/*
Tweets global -> um tweet é um objeto com a estrutura:
{
    username: String,
    avatar: String(url),
    tweet: String,
}
*/
const tweets = [];


function isValidImageUrl(imageUrl) {
    const regex = RegExp(/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/);
    if (imageUrl.match(regex)) {
        return true;
    }

    return false;
}

function isValidPage(page) {
    if (Number(page) >= 1)
        return true;
    return false;
}

//validar campo
function isNotEmpty(param) {
    if (param == "" || param == null) {
        return false;
    }
    return true;
}

//Auth
app.post("/sign-up", (req, res) => {
    if (isNotEmpty(req.body['username']) && isNotEmpty(req.body['avatar'])) {
        if (isValidImageUrl(req.body['avatar'])) {
            const _user = {};
            _user.username = req.body['username'];
            _user.avatar = req.body['avatar'];
            _users.push(_user);
            res.status(201).send("Ok");
        } else {
            res.status(400).send("Informe uma url de imagem válida!");
        }

    } else {
        res.status(400).send("Todos os dados são obrigatórios");
    }
});


//Tweets
app.post("/tweets", (req, res) => {
    if (isNotEmpty(req.headers['user']) && isNotEmpty(req.body['tweet'])) {
        const tweet = {
            username: req.headers['user'],
            tweet: req.body['tweet']
        };
        tweets.push(tweet);
        res.status(201).send("Ok");
    } else {
        res.status(400).send("Todos os dados são obrigatórios");
    }
});


app.get("/tweets", (req, res) => {
    const page = req.query.page;
    if (isNotEmpty(page) && isValidPage(page)) {
        const tweetsReturn = tweets.filter(_ => true).reverse().slice((page - 1) * 10, page * 10);
        tweetsReturn.forEach((value, index, array) => {
            value.avatar = _users.filter(user => user.username == value.username)[0].avatar;
        });
        res.send(tweetsReturn);
    } else {
        res.status().send("Informe uma página válida!");
    }
});


app.get("/tweets/:username", (req, res) => {
    const userTweets = tweets.filter(tweet => {
        tweet.username == req.params.username;
    });
    res.send(userTweets);
});



app.listen(5000);