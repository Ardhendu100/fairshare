import React, { useRef } from 'react';
import { Download, ArrowRight, TrendingUp, TrendingDown, Calculator, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';

const BalanceSheet = ({ friends, expenses, onReset }) => {
  const settlementRef = useRef();

  const calculateBalances = () => {
    const balances = {};
    
    // Initialize balances
    friends.forEach(friend => {
      balances[friend.id] = {
        name: friend.name,
        paid: 0,
        owes: 0,
        balance: 0
      };
    });

    // Calculate what each person paid and owes
    expenses.forEach(expense => {
      const { amount, paidBy, participants, splitMode, customSplits } = expense;

      // Add to what the payer paid
      if (balances[paidBy]) {
        balances[paidBy].paid += amount;
      }

      // Add to what each participant owes
      if (splitMode === 'custom' && customSplits) {
        // Use custom split amounts
        participants.forEach(participantId => {
          if (balances[participantId] && customSplits[participantId]) {
            balances[participantId].owes += parseFloat(customSplits[participantId]);
          }
        });
      } else {
        // Equal split
        const sharePerPerson = amount / participants.length;
        participants.forEach(participantId => {
          if (balances[participantId]) {
            balances[participantId].owes += sharePerPerson;
          }
        });
      }
    });

    // Calculate net balance for each person
    Object.keys(balances).forEach(friendId => {
      balances[friendId].balance = balances[friendId].paid - balances[friendId].owes;
    });

    return balances;
  };

  const calculateSettlements = () => {
    const balances = calculateBalances();
    const settlements = [];

    // Separate creditors (positive balance) and debtors (negative balance)
    const creditors = [];
    const debtors = [];

    Object.entries(balances).forEach(([id, balance]) => {
      if (balance.balance > 0.01) {
        creditors.push({ id: parseInt(id), ...balance });
      } else if (balance.balance < -0.01) {
        debtors.push({ id: parseInt(id), ...balance, balance: Math.abs(balance.balance) });
      }
    });

    // Optimize settlements using a greedy approach
    const creditorsCopy = [...creditors];
    const debtorsCopy = [...debtors];

    while (creditorsCopy.length > 0 && debtorsCopy.length > 0) {
      const creditor = creditorsCopy[0];
      const debtor = debtorsCopy[0];

      const settleAmount = Math.min(creditor.balance, debtor.balance);

      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(settleAmount * 100) / 100
      });

      creditor.balance -= settleAmount;
      debtor.balance -= settleAmount;

      if (creditor.balance <= 0.01) {
        creditorsCopy.shift();
      }
      if (debtor.balance <= 0.01) {
        debtorsCopy.shift();
      }
    }

    return settlements;
  };

  const downloadBillAsImage = async () => {
    if (!settlementRef.current) return;

    try {
      const canvas = await html2canvas(settlementRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      const link = document.createElement('a');
      link.download = `fairshare-settlement-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">Ready to calculate!</h3>
        <p className="text-gray-400">Go back and add expenses to see the settlement</p>
      </div>
    );
  }

  const balances = calculateBalances();
  const settlements = calculateSettlements();
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
        <div className="text-center">
          <p className="text-green-100 text-sm">Total Amount Split</p>
          <p className="text-3xl font-bold">₹{totalAmount.toFixed(2)}</p>
          <p className="text-green-100 text-sm mt-1">{expenses.length} expenses • {friends.length} friends</p>
        </div>
      </div>

      {/* Individual Balances */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b bg-gray-50 rounded-t-lg">
          <h3 className="font-medium text-gray-900">Individual Balances</h3>
        </div>
        <div className="divide-y">
          {Object.entries(balances).map(([id, balance]) => (
            <div key={id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {balance.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{balance.name}</span>
                </div>
                <div className="text-right">
                  {balance.balance > 0.01 ? (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-medium">
                        +₹{balance.balance.toFixed(2)}
                      </span>
                    </div>
                  ) : balance.balance < -0.01 ? (
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-red-600 font-medium">
                        -₹{Math.abs(balance.balance).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500 font-medium">Settled</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 ml-13">
                Paid ₹{balance.paid.toFixed(2)} • Owes ₹{balance.owes.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settlement Instructions */}
      <div ref={settlementRef} className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Settlement</h3>
            <div className="text-xs text-gray-500">
              Generated by FairShare
            </div>
          </div>
        </div>

        <div className="p-4">
          {settlements.length === 0 ? (
            <div className="text-center py-8 text-green-600">
              <CheckCircle className="h-12 w-12 mx-auto mb-3" />
              <h4 className="font-medium text-lg mb-1">All settled up! 🎉</h4>
              <p className="text-sm text-gray-500">Everyone's expenses are balanced.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {settlements.map((settlement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-red-600">
                        {settlement.from.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800">{settlement.from}</span>
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-green-600">
                        {settlement.to.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800">{settlement.to}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      ₹{settlement.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center text-xs text-gray-500 mt-4 pt-3 border-t">
                {settlements.length} transaction{settlements.length !== 1 ? 's' : ''} needed
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={downloadBillAsImage}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download Bill as Image
        </button>
      </div>
    </div>
  );
};

export default BalanceSheet;