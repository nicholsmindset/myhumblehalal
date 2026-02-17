
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import DirectoryMapView from './pages/DirectoryMapView';
import BusinessDetailPage from './pages/BusinessDetailPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import SubmitBusinessPage from './pages/SubmitBusinessPage';
import SubmitEventPage from './pages/SubmitEventPage';
import AboutPage from './pages/AboutPage';
import AdvertisePage from './pages/AdvertisePage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CategoryExplorerPage from './pages/CategoryExplorerPage';
import SupportPage from './pages/SupportPage';
import HalalLivingPage from './pages/HalalLivingPage';
import PrivacyPage from './pages/PrivacyPage';
import LoginPage from './pages/LoginPage';
import ReviewPage from './pages/ReviewPage';
import NotFoundPage from './pages/NotFoundPage';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const App: React.FC = () => {
    return (
        <HashRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/directory" element={<DirectoryPage />} />
                        <Route path="/map" element={<DirectoryMapView />} />
                        <Route path="/categories" element={<CategoryExplorerPage />} />
                        <Route path="/business/:id" element={<BusinessDetailPage />} />
                        <Route path="/review/:id" element={<ReviewPage />} />
                        <Route path="/events" element={<EventsPage />} />
                        <Route path="/event/:id" element={<EventDetailPage />} />
                        <Route path="/submit-business" element={<SubmitBusinessPage />} />
                        <Route path="/submit-event" element={<SubmitEventPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/support" element={<SupportPage />} />
                        <Route path="/living" element={<HalalLivingPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/advertise" element={<AdvertisePage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </HashRouter>
    );
};

export default App;
