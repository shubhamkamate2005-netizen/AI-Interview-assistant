import { useContext, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";
import { getErrorMessage } from "../../../lib/api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;
    const [error, setError] = useState("");

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        setError("");
        try {
            const data = await login({ email, password });
            setUser(data.user);
            return true;
        } catch (err) {
            setError(getErrorMessage(err, "Unable to log in"));
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        setError("");
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
            return true;
        } catch (err) {
            setError(getErrorMessage(err, "Unable to create your account"));
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        handleRegister,
        handleregister: handleRegister,
        handleLogin,
        handlelogin: handleLogin,
        handleLogout,
        handlelogout: handleLogout
    };
};
