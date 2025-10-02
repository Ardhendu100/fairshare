import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Receipt, Calculator, RotateCcw } from 'lucide-react';
import FriendList from './components/FriendList';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import BalanceSheet from './components/BalanceSheet';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [friends, setFriends] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showExpenseSuccess, setShowExpenseSuccess] = useState(false);

  const steps = [
    { id: 'friends', title: 'Add Friends', icon: Users, description: 'Add people to split with' },
    { id: 'expenses', title: 'Add Expenses', icon: Receipt, description: 'Record what was spent' },
    { id: 'summary', title: 'Review', icon: Calculator, description: 'Check all expenses' },
    { id: 'settlement', title: 'Settlement', icon: Calculator, description: 'See who owes what' }
  ];

  const getStepDescription = () => {
    switch (currentStep) {
      case 0: 
        return friends.length === 0 
          ? 'Add people to split with' 
          : `${friends.length} friend${friends.length !== 1 ? 's' : ''} added - Add more or continue`;
      case 1: 
        return expenses.length === 0 
          ? 'Record what was spent' 
          : `${expenses.length} expense${expenses.length !== 1 ? 's' : ''} added - Add more or continue`;
      case 2: 
        return expenses.length === 0 
          ? 'No expenses to review yet' 
          : `Review ${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`;
      case 3: 
        return 'Final settlement calculation';
      default: 
        return steps[currentStep].description;
    }
  };

  const addFriend = (name) => {
    const newFriend = {
      id: Date.now(),
      name: name.trim()
    };
    setFriends([...friends, newFriend]);
  };

  const removeFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id));
    setExpenses(expenses.filter(expense => 
      expense.paidBy !== id && !expense.participants.includes(id)
    ));
  };

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([...expenses, newExpense]);
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const resetAll = () => {
    setFriends([]);
    setExpenses([]);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return friends.length >= 2;
      case 1: return expenses.length > 0;
      default: return true;
    }
  };

  const getStepValidationMessage = () => {
    switch (currentStep) {
      case 0: return friends.length < 2 ? 'Add at least 2 friends to continue' : '';
      case 1: return expenses.length === 0 ? 'Add at least one expense to continue' : '';
      default: return '';
    }
  };

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Calculator className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">FairShare</h1>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    index < currentStep 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : index === currentStep
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {index < currentStep ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 mt-1 text-center">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Step Header */}
      <div className="bg-white border-b">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center">
            <StepIcon className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{currentStepData.title}</h2>
              <p className="text-sm text-gray-600">{getStepDescription()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        {currentStep === 0 && (
          <div className="space-y-4">
            <FriendList 
              friends={friends} 
              onAddFriend={addFriend} 
              onRemoveFriend={removeFriend} 
            />
            {getStepValidationMessage() && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">{getStepValidationMessage()}</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            {/* Progress Indicator */}
            {expenses.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">{expenses.length} expense{expenses.length !== 1 ? 's' : ''} added</span>
                    <span className="text-blue-600"> • Total: ₹{expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</span>
                  </p>
                </div>
              </div>
            )}
            
            <ExpenseForm 
              friends={friends} 
              onAddExpense={addExpense} 
            />
            {getStepValidationMessage() && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">{getStepValidationMessage()}</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            {expenses.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Calculator className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Review your expenses</p>
                    <p className="text-blue-700">Check if everything looks correct, then proceed to calculate the settlement!</p>
                  </div>
                </div>
              </div>
            )}
            
            <ExpenseList 
              expenses={expenses} 
              friends={friends} 
              onRemoveExpense={removeExpense} 
            />
            {expenses.length === 0 && (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No expenses added yet</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <BalanceSheet 
              friends={friends} 
              expenses={expenses} 
              onReset={resetAll} 
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600 active:scale-95'
              }`}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={resetAll}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 active:scale-95 transition-all"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                New Split
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                  !canProceed()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                }`}
              >
                {currentStep === 2 ? 'Calculate' : 'Next'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;