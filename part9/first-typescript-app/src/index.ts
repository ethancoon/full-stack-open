import { calculateBmi, parseBmiArguments } from './bmiCalculator';
import express from 'express';
const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  try {
    const { height, weight } = parseBmiArguments(String(req.query.height), String(req.query.weight));
    const bmi = calculateBmi(height, weight);
    res.json({
      weight,
      height,
      bmi
    });
  } catch (error) {
    res.status(400).json({ error: "malformatted parameters" });
  }
});



const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});