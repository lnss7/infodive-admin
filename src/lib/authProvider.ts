import { AuthProvider } from 'react-admin';
import { signOut, getSession } from 'next-auth/react';

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
            localStorage.setItem('role', data.role || 'ROLE_ADMIN');
            return Promise.resolve();
        }

        throw new Error('Token não retornado pelo servidor');
    },
    
    logout: async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        try {
            await signOut({ redirect: false });
        } catch {
            // Ignora se não houver sessão ativa do NextAuth
        }
        return Promise.resolve();
    },
    
    checkError: (error) => {
        console.error('[AUTH ERROR] React Admin checkError capturou falha:', error);
        const status = error?.status;
        if (status === 401 || status === 403) {
            console.warn('[AUTH LOGOUT] Status 401/403 recebido do backend. Deslogando...');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    
    checkAuth: async () => {
        // 1. Se o token já existe no localStorage, o acesso está autorizado!
        if (localStorage.getItem('token')) {
            return Promise.resolve();
        }

        // 2. Se o token ainda não está no localStorage, mas existe uma sessão da Microsoft (NextAuth)
        try {
            const session = await getSession();
            if (session) {
                const idToken = (session as any).idToken;
                const email = session.user?.email;

                if (idToken || email) {
                    const response = await fetch(`${apiUrl}/auth/login`, {
                        method: 'POST',
                        body: JSON.stringify({ idToken: idToken || email }),
                        headers: new Headers({ 'Content-Type': 'application/json' }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.token) {
                            localStorage.setItem('token', data.token);
                            localStorage.setItem('username', data.email || 'Administrador');
                            localStorage.setItem('role', data.role || 'ROLE_ADMIN');
                            return Promise.resolve();
                        }
                    }
                }
            }
        } catch (err) {
            console.error('[AUTH checkAuth] Erro ao sincronizar sessão NextAuth:', err);
        }

        console.warn('[AUTH checkAuth] Nenhum token em localStorage nem sessão Microsoft ativa.');
        return Promise.reject();
    },
    
    getPermissions: () => {
        const role = localStorage.getItem('role') || 'ROLE_ADMIN';
        const permissions = role === 'ROLE_BLOGGER' ? 'BLOGGER' : 'ADMIN';
        return Promise.resolve(permissions);
    },
    
    getIdentity: () => {
        const username = localStorage.getItem('username') || 'Administrador';
        const role = localStorage.getItem('role') === 'ROLE_BLOGGER' ? 'Editor de Blog' : 'Administrador';
        return Promise.resolve({
            id: 'admin',
            fullName: `${username} (${role})`,
        });
    },
};
