# FairShare

A modern, responsive bill-splitting application built with React, Vite, and TailwindCSS. FairShare helps you split expenses fairly among friends with an intuitive interface and settlement optimization.

## Features

### 🧑‍🤝‍🧑 Friend Management
- Add friends dynamically with name validation
- Remove friends (automatically handles expense cleanup)
- Clean, card-based UI for friend list

### 💰 Expense Tracking
- Add expenses with description, amount, and payer
- Select participants using checkboxes
- Automatic per-person cost calculation
- Date tracking for all expenses

### 📊 Smart Calculations
- Real-time balance calculations
- Shows individual paid vs. owed amounts
- Settlement optimization to minimize transactions
- Clear visualization of who owes whom

### 📱 Modern UI/UX
- Responsive design that works on all devices
- Clean Tailwind CSS styling
- Intuitive icons from Lucide React
- Color-coded balances (green for credits, red for debts)
- Professional branding and layout

### 🖼️ Export Functionality
- Download settlement summary as PNG image
- High-quality image generation using html2canvas
- Perfect for sharing final bills

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **html2canvas** - HTML to image conversion

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd fairshare
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── FriendList.jsx      # Friend management component
│   ├── ExpenseForm.jsx     # Add expense form
│   ├── ExpenseList.jsx     # Display expenses list
│   └── BalanceSheet.jsx    # Settlement calculations & display
├── App.jsx                 # Main application component
├── main.jsx               # React entry point
└── index.css              # Global styles and Tailwind imports
```

## Key Components

### FriendList
- Manages the list of friends
- Add/remove functionality
- Input validation to prevent duplicates

### ExpenseForm
- Form for adding new expenses
- Dropdown for payer selection
- Multi-select checkboxes for participants
- Real-time per-person cost calculation

### ExpenseList
- Displays all expenses in a clean card layout
- Shows expense details and participants
- Delete functionality for expenses

### BalanceSheet
- Calculates and displays individual balances
- Generates optimized settlement instructions
- Export functionality for bill images

## Algorithm Details

### Balance Calculation
1. Initialize balance for each friend (paid: 0, owes: 0)
2. For each expense:
   - Add full amount to payer's "paid"
   - Add equal share to each participant's "owes"
3. Calculate net balance: paid - owes

### Settlement Optimization
Uses a greedy algorithm to minimize transactions:
1. Separate friends into creditors (positive balance) and debtors (negative balance)
2. Match largest creditor with largest debtor
3. Settle the minimum of their amounts
4. Continue until all balances are zero

## Features in Detail

### Responsive Design
- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly buttons and interactions

### Data Management
- All data stored in React state
- Dummy data provided for quick demonstration
- Reset functionality to clear all data

### Error Handling
- Form validation for all inputs
- Graceful handling of edge cases
- User-friendly error messages

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Styling with [TailwindCSS](https://tailwindcss.com/)
- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)