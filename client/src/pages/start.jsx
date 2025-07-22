import { Toaster } from "@/components/ui/sonner";
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Pasgo from '.././pages/pasgo.jsx';
import Navbar from '../elements/navbar';
import Footer from "./../elements/footer.jsx";

function Start() {
    const location = useLocation();

    return (
        <section>
            <Navbar />

            <Toaster richColors />

            {location.pathname === "/" && <Pasgo className="overflow-x-hidden" />}
            {location.pathname !== "/" && <Outlet />}

            <Footer />
        </section>
    )
}

export default Start