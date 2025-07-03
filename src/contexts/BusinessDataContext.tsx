import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for our data
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'lead' | 'customer' | 'prospect';
  value: number;
  createdAt: string;
}

interface BusinessDataContextType {
  // Accounting data
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  
  // Knowledge Base data
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  
  // CRM data
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  
  // Derived data for dashboard
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  customerCount: number;
  leadCount: number;
  totalCustomerValue: number;
  documentCount: number;
  
  // Monthly data for charts
  monthlyData: { month: string; revenue: number; expenses: number }[];
  customerSegments: { name: string; value: number; color: string }[];
}

const BusinessDataContext = createContext<BusinessDataContextType | undefined>(undefined);

export const useBusinessData = () => {
  const context = useContext(BusinessDataContext);
  if (context === undefined) {
    throw new Error('useBusinessData must be used within a BusinessDataProvider');
  }
  return context;
};

export const BusinessDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for each section
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  // Derived data for dashboard
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  
  const customerCount = contacts.filter(c => c.status === 'customer').length;
  const leadCount = contacts.filter(c => c.status === 'lead').length;
  const prospectCount = contacts.filter(c => c.status === 'prospect').length;
  const totalCustomerValue = contacts.reduce((sum, c) => sum + c.value, 0);
  
  const documentCount = documents.length;
  
  // Generate monthly data for charts based on transactions
  const generateMonthlyData = () => {
    if (transactions.length === 0) return [];
    
    // Get the last 6 months
    const today = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      months.push({
        month: monthName,
        date: month,
        revenue: 0,
        expenses: 0
      });
    }
    
    // Populate with transaction data
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthIndex = months.findIndex(m => 
        m.date.getMonth() === transactionDate.getMonth() && 
        m.date.getFullYear() === transactionDate.getFullYear()
      );
      
      if (monthIndex !== -1) {
        if (transaction.type === 'income') {
          months[monthIndex].revenue += transaction.amount;
        } else {
          months[monthIndex].expenses += transaction.amount;
        }
      }
    });
    
    return months.map(({ month, revenue, expenses }) => ({ month, revenue, expenses }));
  };
  
  const monthlyData = generateMonthlyData();
  
  // Generate customer segments data for pie chart
  const customerSegments = [
    { name: "Customers", value: customerCount || 0, color: "hsl(142, 76%, 36%)" },
    { name: "Leads", value: leadCount || 0, color: "hsl(220, 91%, 52%)" },
    { name: "Prospects", value: prospectCount || 0, color: "hsl(25, 95%, 53%)" }
  ].filter(segment => segment.value > 0);
  
  // If no data, add a placeholder
  if (customerSegments.length === 0) {
    customerSegments.push({ name: "No Data", value: 1, color: "hsl(220, 14%, 96%)" });
  }
  
  const value = {
    transactions,
    setTransactions,
    documents,
    setDocuments,
    contacts,
    setContacts,
    totalIncome,
    totalExpenses,
    netProfit,
    customerCount,
    leadCount,
    totalCustomerValue,
    documentCount,
    monthlyData,
    customerSegments
  };
  
  return <BusinessDataContext.Provider value={value}>{children}</BusinessDataContext.Provider>;
};