import { Configuration, OpenAIApi } from "openai";
import { getAllListTask } from "../ClickUp/api";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// getAllListTask();

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  const date_created = req.body.date_created;

  const textValue = req.body.textValue;

  const engine = req.body.engine;

  try {
    // res.status(200).json({ result: await getAllListTask() });

    // return;900200255439
    let str = '', getAllTask;

    console.log(textValue, 'wdsad');
    if (textValue == '') {
      getAllTask = await getAllListTask({ list_id: 9718435, 'date_created': date_created });

      let i = 0;
      getAllTask?.tasks && getAllTask.tasks.forEach((ele, index) => {
        let split = ele.list.name.split(' ')[0];
        if (split == 'Sprint' || split == 'TODO_1238_Mohd') {
          let name = ele['name'];
          // if (index < 3) {
          str += `${i + 1} ) ${name} \n`;
          // }
          i++;
        }
      });
    }


    // const listEngines = await openai.listEngines();

    // return listEngines;
    if (engine == 'None') {
      res.status(200).json({ result: str, allTasl: getAllTask });

      return;
    }

    // const listEngines = await openai.listEngines();

    // return listEngines;
    let completion;
    if (engine == 'gpt-4' || textValue !== '') {
      completion = await openai.createChatCompletion({
        model: engine,
        messages: [{ role: 'user', content: textValue != '' ? textValue : generatePrompt(str) }],
        temperature: 0.7,
        max_tokens: engine == 'gpt-4' ? 7500 : 3700
      });
    } else {
      completion = await openai.createCompletion({
        model: 'gpt-4',
        prompt: generatePrompt(str),
        temperature: 0.7,
        max_tokens: engine == 'text-davinci-003' ? 3500 : 1500
      });
    }

    console.log(completion.data.choices);
    res.status(200).json({ result: completion.data.choices[0].message.content, task: getAllTask });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(str) {
  return `Repharse this in such a way that defines "Value generated this week/ Improvement points (which helped our system to improve)  - " in points
${str}`
}

// function generatePrompt(str){
//   return 'Find the category of this amazon product: Amazon Brand - Solimo Slim Stainless Steel Water Bottle, Set of 3, 1 L Each'
// }

// function generatePrompt(animal) {
//   const capitalizedAnimal =
//     animal[0].toUpperCase() + animal.slice(1).toLowerCase();
//   return `Suggest three names for an animal that is a superhero.

// Animal: Cat
// Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
// Animal: Dog
// Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
// Animal: ${capitalizedAnimal}
// Names:`;
// }
