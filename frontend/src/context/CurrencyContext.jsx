import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    // Default to USD
    const [currency, setCurrency] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('currency');
            try {
                return saved ? JSON.parse(saved) : { code: 'USD', symbol: '$' };
            } catch (e) {
                console.error("Failed to parse currency from local storage", e);
                return { code: 'USD', symbol: '$' };
            }
        }
        return { code: 'USD', symbol: '$' };
    });

    useEffect(() => {
        localStorage.setItem('currency', JSON.stringify(currency));
    }, [currency]);

    const formatMoney = (amount) => {
        if (amount === undefined || amount === null) return 'N.A';
        return `${currency.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const updateCurrency = (code) => {
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'INR': '₹',
            'GBP': '£',
            'JPY': '¥'
        };
        setCurrency({ code, symbol: symbols[code] || '$' });
    };

    return (
        <CurrencyContext.Provider value={{ currency, updateCurrency, formatMoney }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
