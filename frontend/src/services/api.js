const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
    login: async (username, password) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_URL}/token`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    register: async (userData) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: userData.username,
                password: userData.password,
                full_name: userData.full_name,
                phone_number: userData.phone_number,
                dob: userData.dob ? new Date(userData.dob).toISOString() : null
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
        }
        return response.json();
    },

    getCurrentUser: async () => {
        const response = await fetch(`${API_URL}/users/me`, {
            headers: getHeaders(),
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Session expired');
        }
        if (!response.ok) throw new Error('Failed to fetch user');
        return response.json();
    },

    updateUser: async (userData) => {
        const response = await fetch(`${API_URL}/users/me`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getHeaders() },
            body: JSON.stringify(userData),
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Session expired');
        }
        if (!response.ok) throw new Error('Failed to update user');
        return response.json();
    },

    deleteTransactions: async () => {
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Session expired');
        }
        if (!response.ok) throw new Error('Failed to delete transactions');
        return response.json();
    },

    getTransactions: async () => {
        const response = await fetch(`${API_URL}/transactions`, {
            headers: getHeaders(),
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Session expired');
        }
        if (!response.ok) throw new Error('Failed to fetch transactions');
        return response.json();
    },

    createTransaction: async (transaction) => {
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getHeaders() },
            body: JSON.stringify(transaction),
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Session expired');
        }
        if (!response.ok) {
            const error = await response.json();
            const errorMessage = Array.isArray(error.detail)
                ? error.detail.map(e => e.msg).join(', ')
                : (error.detail || 'Failed to create transaction');
            throw new Error(errorMessage);
        }
        return response.json();
    },

    uploadTransactions: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/upload-transactions`, {
            method: 'POST',
            body: formData,
            headers: getHeaders(),
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to upload transactions');
        }
        return response.json();
    },

    getStats: async () => {
        const response = await fetch(`${API_URL}/stats`, {
            headers: getHeaders(),
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Session expired');
        }
        if (!response.ok) throw new Error('Failed to fetch stats');
        return response.json();
    },

    getBudgets: async () => {
        const response = await fetch(`${API_URL}/budgets`, {
            headers: getHeaders(),
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Session expired');
        }
        if (!response.ok) throw new Error('Failed to fetch budgets');
        return response.json();
    },

    createBudget: async (budget) => {
        const response = await fetch(`${API_URL}/budgets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getHeaders() },
            body: JSON.stringify(budget),
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Session expired');
        }
        if (!response.ok) {
            const error = await response.json();
            const errorMessage = Array.isArray(error.detail)
                ? error.detail.map(e => `${e.loc[1] || 'field'}: ${e.msg}`).join(', ')
                : (error.detail || 'Failed to create budget');
            throw new Error(errorMessage);
        }
        return response.json();
    },

    getPrediction: async () => {
        const response = await fetch(`${API_URL}/predict-expenses`, {
            headers: getHeaders(),
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Session expired');
        }
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to fetch prediction');
        }
        return response.json();
    }
};
