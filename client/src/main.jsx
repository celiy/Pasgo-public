import { ThemeProvider } from "@/components/theme-provider";
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Pages from "./pages";

//Criar routes para páginas
const router = createBrowserRouter(Pages());

window.showLoader = () => {
    window.dispatchEvent(new CustomEvent("global-loading", { detail: true }));
};

window.hideLoader = () => {
    window.dispatchEvent(new CustomEvent("global-loading", { detail: false }));
};

createRoot(document.getElementById('root')).render(
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
    </ThemeProvider>
)

document.getElementById('loaderContainer').classList.add('hiddenLoadingElement');

async function hideLoader() {
    await new Promise(resolve => setTimeout(resolve, 300));
    document.getElementById('loaderContainer').remove();
}

hideLoader();