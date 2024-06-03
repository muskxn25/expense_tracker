import React, { useState } from 'react';
import axios from 'axios';
import './style.css'

const App = () => {
  const [place, setPlace] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchExpenses = async () => {
    const response = await axios.get('http://127.0.0.1:5000/api/get_expenses');
    setExpenses(response.data);
    calculateTotal(response.data);
  };

  const calculateTotal = async (expensesList) => {
    const totalResponse = await axios.get('http://127.0.0.1:5000/api/total_amount');
    setTotal(totalResponse.data.total_amount);
  };

  const addExpense = async () => {
    try {
      // Check if the amount is a valid number
      if (isNaN(parseFloat(amount))) {
        throw new Error('Amount must be a valid number');
      }

      // Make the POST request to add the expense
      await axios.post('http://127.0.0.1:5000/api/add_expense', { place, amount: parseFloat(amount) });

      // Fetch the updated list of expenses and total amount spent
      await fetchExpenses();

      // Clear the input fields after successfully adding the expense
      setPlace('');
      setAmount('');
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error adding expense:', error.message);
    }
  };

  return (
    <div className="container">
      <h1 className="mt-5 mb-4">Expense Tracker</h1>
      <form onSubmit={(e) => { e.preventDefault(); addExpense(); }}>
        <div className="form-group">
          <label htmlFor="place">Place:</label>
          <input type="text" className="form-control" id="place" value={place} onChange={(e) => setPlace(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input type="number" className="form-control" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Add Expense</button>
      </form>
      <h2 className="mt-5">All Expenses</h2>
      <ul className="list-group">
        {expenses.map((expense, index) => (
          <li key={index} className="list-group-item">Place: {expense[0]}, Amount: ${expense[1].toFixed(2)}</li>
        ))}
      </ul>
      <h2 className="mt-4">Total Amount Spent: ${total.toFixed(2)}</h2>
    </div>
  );
};

export default App;
