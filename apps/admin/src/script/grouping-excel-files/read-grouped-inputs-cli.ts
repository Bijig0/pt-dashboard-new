// @ts-nocheck
import inquirer from "inquirer";

export async function readGroupedInputsCLI(): Promise<string[][]> {
  const results: string[][] = [];
  let continueInput = true;

  while (continueInput) {
    const response = await inquirer.prompt<{ input: string }>({
      type: "input",
      name: "input",
      message: 'Enter a comma-separated list of numbers (or "end" to finish):',
      validate: (value: string) => {
        if (value.toLowerCase() === "end") return true;

        const numbers = value.split(",").map((num) => num.trim());
        const isValid = numbers.every(
          (num) => !isNaN(Number(num)) && num !== ""
        );

        return isValid || "Please enter valid comma-separated numbers.";
      },
    });

    if (response.input.toLowerCase() === "end") {
      continueInput = false;
    } else {
      const numberGroup = response.input.split(",").map((num) => num.trim());
      results.push(numberGroup);
    }
  }

  return results;
}
