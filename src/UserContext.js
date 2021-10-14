import React from 'react';
import { TOKEN_POST, TOKEN_VALIDATE_POST, USER_GET } from './api';
import { useNavigate } from 'react-router-dom';

export const UserContext = React.createContext();

export const UserStorage = ({ children }) => {
    const [data, setData] = React.useState(null);
    const [login, setLogin] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    const userLogout = React.useCallback(
        async function () {
        setData(null);
        setError(null);
        setLoading(false);
        setLogin(false);
        window.localStorage.removeItem('token');
        navigate('/login');
     },
     [navigate],
    );
    
    async function getUser(token) {
        const { url, options } = USER_GET(token);
        const response = await fetch(url, options);
        const json = await response.json();
        setData(json);
        setLogin(true);
    }

    async function userLogin(username, password) {
        try {
            setError(null);
            setLoading(true);
            //const { url, options } = TOKEN_POST(username, password);
            //const tokenRes = await fetch(url, options);
            // Se usar as duas linhas de cima não funciona.. somente as de baixo
            const tokenRes = await fetch(`https://dogsapi.origamid.dev/json/jwt-auth/v1/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                }),
            });

            if (!tokenRes.ok) throw new Error(`Error: Usuario Inválido}`);
            const { token } = await tokenRes.json();
            window.localStorage.setItem('token', token);
            await getUser(token);
            navigate('/conta');
        } catch (err) {
            setError(err.menssage);
            setLogin(false);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        async function autoLogin() {
            const token = window.localStorage.getItem('token');
            if (token) {
                try {
                    setError(null);
                    setLoading(true);
                    const { url, options } = TOKEN_VALIDATE_POST(token)
                    const response = await fetch(url, options);
                    if (!response.ok) throw new Error('Token inválido');
                    const json = await response.json();
                    await getUser(token);
                } catch (err) {
                    userLogout();
                } finally {
                    setLoading(false);

                }
            } else {
                setLogin(false);
            }
        }
        autoLogin();
    }, [userLogout]);

    return (
        <UserContext.Provider value={{ userLogin, userLogout, data, error, loading, login }}>
            {children}
        </UserContext.Provider>
    );
};
