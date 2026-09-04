import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

const FALLBACK_RATES = {
    INR: 1.0,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.007818, // 1 pound = 127.9 rs -> 1 / 127.9 = 0.007818
    JPY: 1.82,
    CNY: 0.086,
    SGD: 0.016,
    KRW: 15.68,
    AED: 0.044,
    ZAR: 0.23,
    EGP: 0.58,
    NGN: 18.24,
    KES: 1.56,
    GHS: 0.18
};

export const CurrencyProvider = ({ children }) => {
    // Default to USD display preference
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

    const [rates, setRates] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('exchange_rates');
            try {
                return saved ? JSON.parse(saved) : FALLBACK_RATES;
            } catch (e) {
                console.error("Failed to parse rates from local storage", e);
                return FALLBACK_RATES;
            }
        }
        return FALLBACK_RATES;
    });

    useEffect(() => {
        localStorage.setItem('currency', JSON.stringify(currency));
    }, [currency]);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const res = await fetch('https://open.er-api.com/v6/latest/INR');
                if (!res.ok) throw new Error('API response not OK');
                const data = await res.json();
                if (data && data.rates) {
                    const newRates = {
                        ...FALLBACK_RATES,
                        ...data.rates
                    };
                    setRates(newRates);
                    localStorage.setItem('exchange_rates', JSON.stringify(newRates));
                }
            } catch (err) {
                console.error('Failed to fetch live exchange rates, using fallback:', err);
            }
        };
        fetchRates();
    }, []);

    const convertAmount = (amount) => {
        if (amount === undefined || amount === null) return 0;
        const val = parseFloat(amount);
        if (isNaN(val)) return 0;
        return val * (rates[currency.code] || 1.0);
    };

    const convertToBaseCurrency = (amount) => {
        if (amount === undefined || amount === null) return 0;
        const val = parseFloat(amount);
        if (isNaN(val)) return 0;
        return val / (rates[currency.code] || 1.0);
    };

    const formatMoney = (amount) => {
        if (amount === undefined || amount === null) return 'N.A';
        const converted = convertAmount(amount);
        return `${currency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
        <CurrencyContext.Provider value={{ currency, updateCurrency, formatMoney, rates, convertAmount, convertToBaseCurrency }}>
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
