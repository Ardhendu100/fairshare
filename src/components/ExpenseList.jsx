import React from 'react';
import { Trash2, Receipt, Users, IndianRupee } from 'lucide-react';

const ExpenseList = ({ expenses, friends, onRemoveExpense }) => {
  const getFriendName = (id) => {
    const friend = friends.find(f => f.id === id);
    return friend ? friend.name : 'Unknown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <Receipt className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">No expenses yet</h3>
        <p className="text-gray-400">Go back and add your first expense</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Expenses</p>
            <p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Count</p>
            <p className="text-xl font-semibold">{expenses.length}</p>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white rounded-lg border shadow-sm overflow-hidden"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{expense.description}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      {expense.amount.toFixed(2)}
                    </span>
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveExpense(expense.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete expense"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Paid by */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-green-600">
                      {getFriendName(expense.paidBy).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">{getFriendName(expense.paidBy)}</span> paid
                  </span>
                </div>
              </div>

              {/* Participants */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Split among {expense.participants.length} • ₹{(expense.amount / expense.participants.length).toFixed(2)} each
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {expense.participants.map((participantId) => (
                    <div
                      key={participantId}
                      className="flex items-center gap-1 px-2 py-1 bg-white rounded-full border"
                    >
                      <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {getFriendName(participantId).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {getFriendName(participantId)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;