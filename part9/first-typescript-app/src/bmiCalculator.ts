export const parseBmiArguments = (height: String, weight: String): { height: number, weight: number } => {
    if (isNaN(Number(height)) || isNaN(Number(weight))) throw new Error('Provided values were not numbers!');
    return {
        height: Number(height),
        weight: Number(weight)
    };
}

export const calculateBmi = (height: number, weight: number): string => {
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