import React, { useState, useEffect } from 'react';
import { Plus, IndianRupee, Receipt, CheckCircle, Edit2, Check, X } from 'lucide-react';

const ExpenseForm = ({ friends, onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [participants, setParticipants] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastAddedExpense, setLastAddedExpense] = useState(null);
  const [customSplits, setCustomSplits] = useState({}); // { friendId: amount }
  const [editingParticipant, setEditingParticipant] = useState(null); // Track which participant is being edited

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!description.trim() || !amount || !paidBy || participants.length === 0) {
      return;
    }

    const expenseData = {
      description: description.trim(),
      amount: parseFloat(amount),
      paidBy: parseInt(paidBy),
      participants: participants.map(id => parseInt(id)),
      splitMode: 'custom',
      customSplits: customSplits
    };

    // Store the expense info for success message
    const paidByName = friends.find(f => f.id === parseInt(paidBy))?.name;
    setLastAddedExpense({
      description: description.trim(),
      amount: parseFloat(amount),
      paidByName,
      participantCount: participants.length
    });

    onAddExpense(expenseData);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    // Reset form
    setDescription('');
    setAmount('');
    setPaidBy('');
    setParticipants([]);
    setCustomSplits({});
    setEditingParticipant(null);
  };

  const handleParticipantChange = (friendId, checked) => {
    if (checked) {
      const newParticipants = [...participants, friendId];
      setParticipants(newParticipants);
      // Initialize equal split for new participant
      if (amount) {
        redistributeAmounts(newParticipants, null);
      }
    } else {
      const newParticipants = participants.filter(id => id !== friendId);
      setParticipants(newParticipants);
      // Remove custom split for removed participant and redistribute
      const newSplits = { ...customSplits };
      delete newSplits[friendId];
      setCustomSplits(newSplits);
      if (amount && newParticipants.length > 0) {
        redistributeAmounts(newParticipants, null);
      }
    }
  };

  const selectAllParticipants = () => {
    const allIds = friends.map(f => f.id.toString());
    setParticipants(allIds);
    // Initialize equal splits for all
    if (amount) {
      redistributeAmounts(allIds, null);
    }
  };

  const clearAllParticipants = () => {
    setParticipants([]);
    setCustomSplits({});
    setEditingParticipant(null);
  };

  // Automatically redistribute remaining amount among non-edited participants
  const redistributeAmounts = (participantList, excludeParticipantId) => {
    if (!amount || participantList.length === 0) return;

    const totalAmount = parseFloat(amount);
    const newSplits = { ...customSplits };

    if (excludeParticipantId && newSplits[excludeParticipantId]) {
      // One participant was manually edited, redistribute remaining among others
      const editedAmount = parseFloat(newSplits[excludeParticipantId]);
      const remainingAmount = totalAmount - editedAmount;
      const otherParticipants = participantList.filter(id => id !== excludeParticipantId);
      
      if (otherParticipants.length > 0) {
        const sharePerOther = remainingAmount / otherParticipants.length;
        otherParticipants.forEach((id, index) => {
          // Adjust last person to account for rounding
          if (index === otherParticipants.length - 1) {
            const otherTotal = sharePerOther * (otherParticipants.length - 1);
            newSplits[id] = (remainingAmount - otherTotal).toFixed(2);
          } else {
            newSplits[id] = sharePerOther.toFixed(2);
          }
        });
      }
    } else {
      // Equal split for all
      const equalAmount = totalAmount / participantList.length;
      participantList.forEach((id, index) => {
        // Adjust last person to account for rounding
        if (index === participantList.length - 1) {
          const otherTotal = equalAmount * (participantList.length - 1);
          newSplits[id] = (totalAmount - otherTotal).toFixed(2);
        } else {
          newSplits[id] = equalAmount.toFixed(2);
        }
      });
    }

    setCustomSplits(newSplits);
  };

  const handleCustomSplitChange = (friendId, value) => {
    // Update the edited participant's amount
    const newSplits = {
      ...customSplits,
      [friendId]: value
    };
    setCustomSplits(newSplits);
    setEditingParticipant(friendId);
  };

  const handleCustomSplitBlur = (friendId) => {
    // When user finishes editing, redistribute remaining amount
    if (customSplits[friendId] && amount) {
      redistributeAmounts(participants, friendId);
    }
    setEditingParticipant(null);
  };

  // Auto-update splits when amount or participants change
  useEffect(() => {
    if (amount && participants.length > 0) {
      redistributeAmounts(participants, editingParticipant);
    }
  }, [amount, participants.length]);

  const isFormValid = () => {
    if (!description.trim() || !amount || !paidBy || participants.length === 0) {
      return false;
    }
    return true;
  };

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
    <div className="space-y-4">
      {/* Success Message */}
      {showSuccess && lastAddedExpense && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-green-800 mb-1">Expense Added Successfully! ✅</h4>
              <div className="text-sm text-green-700">
                <p><span className="font-medium">{lastAddedExpense.description}</span> for ₹{lastAddedExpense.amount.toFixed(2)}</p>
                <p>Paid by <span className="font-medium">{lastAddedExpense.paidByName}</span> • Split among {lastAddedExpense.participantCount} people</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <div key={friend.id} className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  participants.includes(friend.id.toString()) ? 'bg-white' : 'hover:bg-white'
                }`}>
                  <div className="flex items-center flex-1">
                    <input
                      id={`participant-checkbox-${friend.id}`}
                      type="checkbox"
                      checked={participants.includes(friend.id.toString())}
                      onChange={(e) => handleParticipantChange(friend.id.toString(), e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor={`participant-checkbox-${friend.id}`} className="flex items-center cursor-pointer select-none">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600">
                          {friend.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-700">{friend.name}</span>
                    </label>
                  </div>
                  {/* Custom Split Input - Always visible for selected participants */}
                  {participants.includes(friend.id.toString()) && amount && (
                    <div className="flex items-center gap-1 ml-2">
                      <IndianRupee className="h-3 w-3 text-gray-500" />
                      <input
                        type="number"
                        value={customSplits[friend.id.toString()] || ''}
                        onChange={(e) => handleCustomSplitChange(friend.id.toString(), e.target.value)}
                        onKeyUp={() => handleCustomSplitBlur(friend.id.toString())}
                        onBlur={() => handleCustomSplitBlur(friend.id.toString())}
                        placeholder="0"
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
                        min="0"
                        step="0.01"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Summary */}
            {participants.length > 0 && amount && (
              <div className="mt-3">
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700 font-medium">Total:</span>
                    <span className="text-blue-800 font-semibold">
                      ₹{parseFloat(amount).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Split among {participants.length} participant{participants.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid()}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isFormValid() 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Plus className="h-5 w-5" />
          Add Expense
        </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;