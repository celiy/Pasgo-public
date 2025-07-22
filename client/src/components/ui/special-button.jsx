import { useTheme } from "@/components/theme-provider";
import { useNavigate } from 'react-router-dom';
import '../../special-button.scss';
import { Button } from './button';

export const SpecialButton = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    return (
        <>
            {theme === "dark" && (
                <Button
                    className="text-lg special-button-dark"
                    onClick={() => window?.isLoggedIn ? navigate('/dashboard/inicio') : navigate('/auth')}
                >
                    {window?.isLoggedIn ? 'Entrar no aplicativo' : 'Começar'}
                </Button>
            )}
            {theme === "light" && (
                <Button
                    className="text-lg special-button-light"
                    onClick={() => window?.isLoggedIn ? navigate('/dashboard/inicio') : navigate('/auth')}
                >
                    {window?.isLoggedIn ? 'Entrar no aplicativo' : 'Começar'}
                </Button>
            )}
        </>
    );
}