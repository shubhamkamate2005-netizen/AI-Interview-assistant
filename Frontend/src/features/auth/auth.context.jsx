import { createContext, useEffect, useState } from "react";
import { getme, hasAuthSession } from "./services/auth.api.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (!hasAuthSession()) {
                setLoading(false);
                return;
            }
            try {
                const data = await getme();
                setUser(data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
            
        };

        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, setUser, loading, setLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
