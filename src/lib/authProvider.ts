import { AuthProvider } from 'react-admin';
import { signOut } from 'next-auth/react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const authProvider: AuthProvider = {
    login: async ({ username }) => {
        const idToken = (username || '').trim();

        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ idToken }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            let parsedMessage = 'Falha na autenticação com a Microsoft';
            try {
                const errorJson = JSON.parse(errorText);
                parsedMessage = errorJson.message || errorJson.error || parsedMessage;
            } catch {
                if (errorText) parsedMessage = errorText;
            }
            throw new Error(parsedMessage);
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.email || 'Administrador');
            return Promise.resolve();
        }

        throw new Error('Token não retornado pelo servidor');
    },
    
    logout: async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        try {
            await signOut({ redirect: false });
        } catch {
            // Ignora se não houver sessão ativa do NextAuth
        }
        return Promise.resolve();
    },
    
    checkError: (error) => {
        const status = error?.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    
    checkAuth: () => {
        return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
    },
    
    getPermissions: () => Promise.resolve(),
    
    getIdentity: () => {
        const username = localStorage.getItem('username') || 'Administrador';
        return Promise.resolve({
            id: 'admin',
            fullName: username,
        });
    },
};
