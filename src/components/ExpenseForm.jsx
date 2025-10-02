import React, { useState } from 'react';
import { Plus, IndianRupee, Receipt } from 'lucide-react';

const ExpenseForm = ({ friends, onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [participants, setParticipants] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!description.trim() || !amount || !paidBy || participants.length === 0) {
      return;
    }

    const expenseData = {
      description: description.trim(),
      amount: parseFloat(amount),
      paidBy: parseInt(paidBy),
      participants: participants.map(id => parseInt(id))
    };

    onAddExpense(expenseData);
    
    // Reset form
    setDescription('');
    setAmount('');
    setPaidBy('');
    setParticipants([]);
  };

  const handleParticipantChange = (friendId, checked) => {
    if (checked) {
      setParticipants([...participants, friendId]);
    } else {
      setParticipants(participants.filter(id => id !== friendId));
    }
  };

  const selectAllParticipants = () => {
    setParticipants(friends.map(f => f.id.toString()));
  };

  const clearAllParticipants = () => {
    setParticipants([]);
  };

  const isFormValid = description.trim() && amount && paidBy && participants.length > 0;

  if (friends.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <Receipt className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">Add friends first</h3>
        <p className="text-gray-400">You need to add friends before creating expenses</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What was it for?
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Dinner, Movie tickets, Groceries"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            maxLength={100}
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How much was spent?
          </label>
          <div className="relative">
            <IndianRupee className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Paid By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who paid?
          </label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white"
          >
            <option value="">Select who paid</option>
            {friends.map(friend => (
              <option key={friend.id} value={friend.id}>
                {friend.name}
              </option>
            ))}
          </select>
        </div>

        {/* Participants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Split between whom?
          </label>
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={selectAllParticipants}
                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearAllParticipants}
                className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="space-y-3">
              {friends.map(friend => (
                <label key={friend.id} className="flex items-center p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={participants.includes(friend.id.toString())}
                    onChange={(e) => handleParticipantChange(friend.id.toString(), e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3 w-4 h-4"
                  />
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-blue-600">
                      {friend.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-700">{friend.name}</span>
                </label>
              ))}
            </div>
            {participants.length > 0 && amount && (
              <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">₹{(parseFloat(amount) / participants.length).toFixed(2)} per person</span>
                  <span className="text-blue-600"> • {participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isFormValid 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Plus className="h-5 w-5" />
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;