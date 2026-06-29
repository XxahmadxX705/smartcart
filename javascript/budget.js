import {savebudget, loadbudget} from './storage.js';

 function createBudget() {
    let budget = loadbudget();

    return {
        setBudget(amount) {
            budget = amount;
            savebudget(budget);
        },
        getBudget() {
            return budget;
        }
    }
}
export const budgetCounter = createBudget();
