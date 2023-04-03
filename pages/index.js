import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import '@shopify/polaris/build/esm/styles.css';

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState('');
  const [engine, setEngine] = useState('None');

  const [startDate, setStartDate] = useState(new Date().valueOf());

  const [textValue, setTextValue] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: "a", 'engine': engine, date_created: startDate, textValue: textValue }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Select Start Date</h3>
        <DatePicker selected={startDate} onChange={(date) => {

          console.log(date.valueOf(), "Zsddsggsxdg");
          setStartDate(date.valueOf())
        }} />
        <input type={'text'} value={textValue} onChange={(e) => { setTextValue(e.target.value) }} />
        <button onClick={onSubmit}>Click to proceed</button>
        <br></br>
        <label for="cars">Choose a Engine</label>
        <select id="cars" name="cars" onChange={(e) => { setEngine(e.target.value) }}>
          <option value="None">None</option>
          <option value="use-text">use-text</option>
          <option value="gpt-4">gpt-4</option>
          <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          <option value="text-davinci-003">text-davinci-003</option>
          <option value="text-curie-001">text-curie-001</option>gpt-3.5-turbo
          <option value="text-babbage-001">text-babbage-001</option>
          <option value="text-ada-001">text-ada-001</option>
        </select>
        {/* <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form> */}
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
