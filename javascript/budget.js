import {saveTransactions, loadTransactions , loadbudget} from './storage.js';

 function createBudget() {
    let transactions = loadTransactions();

    if(transactions.length === 0) {
        const oldBudget = loadbudget();
        if(oldBudget > 0){
            transactions.push({
                type: 'deposit',
                amount: oldBudget,
                date: new Date().toISOString(),
            });
            saveTransactions(transactions);
        }
    }

    function getBudget(){
        return transactions.reduce((sum, transaction) => {
            if(transaction.type === 'deposit'){
                return sum + transaction.amount;
            }
            if(transaction.type === 'withdraw'){
                return sum - transaction.amount;
            }
            return sum;
        }, 0);
    }

    return {
        getBudget,

        getTransactions(){
            return transactions;
        },

        deposit(amount){
            transactions.push({
            type: 'deposit',
            amount: amount,
            date: new Date().toISOString(),
        });
        saveTransactions(transactions);
        },

        withdraw(amount){
            transactions.push({
                type: 'withdraw',
                amount: amount,
                date: new Date().toISOString(),
            });
            saveTransactions(transactions);
        }
    };
}
export const budgetCounter = createBudget();
