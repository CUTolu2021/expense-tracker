const fs = require('fs');
const { program } = require('commander');
const { v4: uuidv4 } = require('uuid');
const Table = require('cli-table3');
const EXPENSES_FILE = './expenses.json';

function loadExpenses() {
    try {
            if (!fs.existsSync(EXPENSES_FILE)) {
                return [];
            }
    
            const dataBuffer = fs.readFileSync(EXPENSES_FILE);
             if (dataBuffer.length === 0) {
            return [];
        }
            const dataJSON = dataBuffer.toString();
              
            return JSON.parse(dataJSON);
        }
        catch (error) {
            console.error('Error reading tasks:', error);
            return [];
        }
}

function saveExpenses(expenses) {
    const dataJSON = JSON.stringify(expenses, null, 2);
    fs.writeFileSync(EXPENSES_FILE, dataJSON);
}

function addExpense(options) {
    const expenses = loadExpenses();
    const amount = parseFloat(options.amount);
    const category = options.category || 'Uncategorized';
    const description = options.description;
    
    if (isNaN(amount) || amount <= 0) {
        console.error('Amount must be a positive number.');
        return;
    }

    if (!description || !amount) {
        console.log('Description and amount are required to add an expense.');
        return;
    }

    const newExpense = {
        id: uuidv4(), 
        description: options.description, 
        amount: amount, 
        category: category || 'Uncategorized',
        date: new Date().toISOString() 
    };

    expenses.push(newExpense);
    saveExpenses(expenses);
    console.log(`✅ Expense added: ${description} - $${amount} (ID: ${newExpense.id})`);
}

function listExpenses(options) {
    const expenses = loadExpenses();
    if (expenses.length === 0) {
        console.log('No expenses found. Please add an expense first.');
        return;
    }

    const table = new Table({
        head: ['ID', 'Date', 'Description', 'Amount', 'Category'],
        colWidths: [10, 15, 30, 10, 15]
    });

    expenses.forEach(exp => {
        table.push([
            exp.id, 
            new Date(exp.date).toLocaleDateString(), 
            exp.description, 
            `$${exp.amount.toFixed(2)}`, 
            exp.category || 'Uncategorized'
        ]);
    });

    console.log(table.toString());
//     else if (category) {
//         const filteredExpenses = expenses.filter(exp => exp.category.toLowerCase() === category.toLowerCase());
//         if (filteredExpenses.length === 0) {
//             console.log(`No expenses found in category: ${category}`);
//             return;
//         }
//         console.log(`--- Expenses in category: ${category} ---`);
//         console.log(`\n# ID  Date       Description  Amount`);
//         filteredExpenses.forEach(exp => {
//             console.log(`# ${exp.id}  ${new Date(exp.date).toLocaleDateString()}  ${exp.description.padEnd(15)}  $${exp.amount}`);
//         });
//     }
//     else {
//         console.log(`--- All Expenses ---`);
//         console.log(`\n# ID  Date       Description  Amount Category`);
//         expenses.forEach(exp => {
//             console.log(`# ${exp.id}  ${new Date(exp.date).toLocaleDateString()}  ${exp.description.padEnd(15)}  $${exp.amount} ${exp.category}`);
//         });
//     }
}

function expenseSummary(options) {
    let expenses = loadExpenses();
    const month = parseInt(options.month, 10);
    const category = options.category;
    if (expenses.length === 0) {
        console.log('No expenses found.');
        return;
    }

    if (options.month) {
         
        if (isNaN(month) || month < 1 || month > 12) {
            console.error('Error: Please provide a valid month number (1-12).');
            return;
        }
        expenses = expenses.filter(exp => new Date(exp.date).getMonth() + 1 === parseInt(month));
        if (expenses.length === 0) {
            console.error('Error: No expenses found for the specified month.');
            return;
        }
    }

    if (options.category) {
         
        expenses = expenses.filter(exp => exp.category.toLowerCase() === category.toLowerCase());
        if (expenses.length === 0) {
            console.log(`No expenses found in category: ${category}${options.month ? ` for month: ${options.month}` : ''}`);
            return;
        }
    }

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    if (options.month && options.category) {
        console.log(`Total expenses in category '${category}' for month ${month}: $${total}`);
    } else if (options.month) {
        console.log(`Total expenses in month ${month}: $${total}`);
    } else if (options.category) {
        console.log(`Total expenses in category '${category}': $${total}`);
    } else {
        console.log(`Total expenses: $${total}`);
    }
}

function deleteExpense(id) {
    const expenses = loadExpenses();
    const initialCount = expenses.length;
    // Filter out the expense with the matching ID.
    const updatedExpenses = expenses.filter(exp => exp.id !== options.id);

    if (updatedExpenses.length === initialCount) {
        console.error(`Error: Expense with ID "${options.id}" not found.`);
        return;
    }

    saveExpenses(updatedExpenses);
    console.log('✅ Expense deleted successfully.');
}

function updateExpense(options) {
    const expenses = loadExpenses();
    const index = expenses.findIndex(exp => exp.id === options.id);
    if (index === -1) {
        console.error(`Error: Expense with ID "${options.id}" not found.`);
        return;
    }
    const description = options.description;
    const amount =  parseFloat(options.amount);
    const category = options.category;
    
    if (!description && !amount && !category) {
        console.log('No updates provided. Please specify at least one field to update.');
        return;
    }
    if (description) expenses[index].description = description;
    if (amount) expenses[index].amount = parseFloat(amount);
    if (category) expenses[index].category = category;

    saveExpenses(expenses);
    console.log(`Updated expense: ${expenses[index].description} - $${expenses[index].amount} (ID: ${expenses[index].id})`);
}

program
    .name('expense-tracker')
    .description('A simple CLI tool to track your expenses.')
    .version('1.0.0');

// 2. The 'add' command
program
    .command('add')
    .description('Add a new expense')
    .requiredOption('-d, --description <text>', 'Description of the expense')
    .requiredOption('-a, --amount <number>', 'Amount of the expense')
    .option('-c, --category <text>', 'Expense Category')
    .action(addExpense);

// 3. The 'list' command
program
    .command('list')
    .description('List all expenses')
    .action(listExpenses);

// 4. The 'delete' command
program
    .command('delete')
    .description('Delete an expense by its ID')
    .requiredOption('--id <uuid>', 'The ID of the expense to delete')
    .action(deleteExpense);

// 5. The 'summary' command
program
    .command('summary')
    .description('Show a summary of all expenses')
    .option('-m, --month <number>', 'Filter summary by a specific month (e.g., 8 for August)')
    .option('-c, --category <text>', 'Expense Category')
    .action(expenseSummary);

//6. The 'update' command
program
    .command('update')
    .description('Update some info on your expenses')
    .requiredOption('--id <uuid>', 'The ID of the expense to delete')
    .option('-d, --description <text>', 'Description of the expense')
    .option('-a, --amount <number>', 'Amount of the expense')
    .option('-c, --category <text>', 'Expense Category')
    .action(updateExpense);


// This line parses the arguments from the command line and executes the correct action.
program.parse(process.argv);