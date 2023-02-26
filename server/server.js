import express from 'express'
import * as dotenv from "dotenv"  //to get data from env file
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config();         //to use dotenv variables
const configuration = new Configuration({ apiKey: process.env.OPEN_API_KEY });  //Configuration takes objects
const openAi = new OpenAIApi(configuration);

const app = express();
app.use(cors());         //allow to make crossover requests, allow server to called from frontend
app.use(express.json())  //allow passing json form frontend to backend

app.get("/", async (req, res) => {                   //creating dummy route that read data
    res.status(200).send({ message: "Hello Tanmaya" })
})
app.post("/", async (req, res) => {                  // alows us to have a body or payload
    try {
        const prompt = req.body.prompt;
        const response = await openAi.createCompletion({       //it receive a object which we get from openAi text-devansi-3
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        })

        res.status(200).send({bot:response.data.choices[0].text})
    } catch (error) {
        console.log(error)
        res.status(500).send({error})
    }


})
app.listen(5000,()=>{console.log("server is running at localhost 5000")})



//cors dependency is used to cross request , dotenv used for secure envirnmental variable