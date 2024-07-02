export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  target: number;
  daily_exercises: Array<number>;
}

export const parseExerciseArguments = (args: Array<string>): ExerciseValues => {
    if (args.length < 4) throw new Error('Not enough arguments');
    const target = Number(args[2]);
    const daily_exercises = args.slice(3).map(Number);

    if (isNaN(target) || daily_exercises.some(isNaN)) {
        throw new Error('Provided values were not numbers!');
    }

    return {
        target,
        daily_exercises
    };
};

export const calculateExercises = (daily_exercises: Array<number>, target: number): Result => {
    const periodLength = daily_exercises.length;
    const trainingDays = daily_exercises.filter(d => d > 0).length;
    const average = daily_exercises.reduce((a, b) => a + b, 0) / periodLength;
    const success = average >= target;
    const rating = average < target ? 1 : average === target ? 2 : 3;
    const ratingDescription = rating === 1 ? 'You need to work harder' : rating === 2 ? 'Good job!' : 'Excellent job!';
    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};