https://roadmap.sh/projects/expense-tracker
# Expense Tracker CLI
A simple command-line tool to help you track your daily expenses. You can add, list, delete, and view summaries of your expenses right from the terminal.

This project is built with Node.js and uses commander for command handling and cli-table3 for clean, readable output.

Prerequisites
Make sure you have Node.js installed on your computer. You can check by running:

node -v

Installation
Clone the repository:

git clone https://github.com/CUTolu2021/expense-tracker.git

Navigate into the project folder:

cd expense-tracker

Install the necessary packages:

npm install

How to Use
The application is controlled with a series of simple commands.

Add an Expense
Use the add command with a description and an amount.

Syntax:

node index.js add -d "<description>" -a <amount>

Example:

node index.js add --description "Lunch with team" --amount 25.50

List All Expenses
Use the list command to see all your recorded expenses in a clean table.

Example:

node index.js list

Delete an Expense
Use the delete command with the unique ID of the expense you want to remove. You can get the ID from the list command.

Syntax:

node index.js delete --id <expense_id>

Example:

node index.js delete --id "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"

View Expense Summary
Use the summary command to see the total amount of your expenses. You can also filter by month.

Examples:

# Get a summary of all expenses
node index.js summary

# Get a summary for a specific month (e.g., August, the 8th month)
node index.js summary --month 8
