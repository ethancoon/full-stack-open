
const parseArguments2 = (args: Array<string>): { height: number, weight: number } => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');
    if (isNaN(Number(args[2])) || isNaN(Number(args[3]))) throw new Error('Provided values were not numbers!');
    return {
        height: Number(args[2]),
        weight: Number(args[3])
    };
}

const calculateBmi = (height: number, weight: number): string => {
    const bmi = weight / Math.pow(height / 100, 2);
    if (bmi < 18.5) {
        return 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
        return 'Normal (healthy weight)';
    } else if (bmi >= 25 && bmi < 30) {
        return 'Overweight';
    } else {
        return 'Obese';
    }
};

try {
    const { height, weight } = parseArguments2(process.argv);
    console.log(calculateBmi(height, weight));
} catch (error: unknown) {
    if (error instanceof Error) {
        console.log('Error, something bad happened, message: ', error.message);
    }
}