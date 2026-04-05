import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { api } from '../../services/api';

const PlaidLink = ({ onSuccess }) => {
    const [linkToken, setLinkToken] = useState(null);

    const generateToken = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/create_link_token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setLinkToken(data.link_token);
        } catch (error) {
            console.error('Error generating link token:', error);
        }
    };

    useEffect(() => {
        generateToken();
    }, []);

    const handleOnSuccess = useCallback(async (public_token, metadata) => {
        try {
            await fetch(`http://127.0.0.1:8000/api/set_access_token?public_token=${public_token}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error setting access token:', error);
        }
    }, [onSuccess]);

    const config = {
        token: linkToken,
        onSuccess: handleOnSuccess,
    };

    const { open, ready } = usePlaidLink(config);

    return (
        <button
            onClick={() => open()}
            disabled={!ready}
            className={`px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 shadow-lg ${ready
                    ? 'bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 shadow-accent/10'
                    : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                }`}
        >
            {ready ? 'Establish Bank Node' : 'Initializing Link...'}
        </button>
    );
};

export default PlaidLink;
