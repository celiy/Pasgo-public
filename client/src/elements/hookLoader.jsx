import { useEffect, useState } from "react";

export const Loader = () => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleLoadingEvent = (event) => {
            setIsLoading(event.detail);
        };

        window.addEventListener("global-loading", handleLoadingEvent);

        return () => {
            window.removeEventListener("global-loading", handleLoadingEvent);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed top-0 left-0 z-50 w-full h-1">
            <div 
                className="z-50 h-1 bg-chart-1 loading-bar"
            />
        </div>
    );
};
