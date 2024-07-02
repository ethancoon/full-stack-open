import { calculateBmi, parseBmiArguments } from './bmiCalculator';
import { calculateExercises, Result } from './exerciseCalculator';
import express from 'express';
const app = express();
app.use(express.json());

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

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.status(400).json({ error: 'parameters missing' });
    throw new Error('parameters missing');
  }

  if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
    res.status(400).json({ error: 'malformatted parameters' });
    throw new Error('malformatted parameters');
  }

  const daily_exercises_numbers = daily_exercises.map(Number);

  if (daily_exercises_numbers.some(isNaN) || isNaN(Number(target))) {
    res.status(400).json({ error: 'malformatted parameters' });
    throw new Error('malformatted parameters');
  }

  const result: Result = calculateExercises(daily_exercises_numbers, Number(target));

  res.json(result);
});


const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});