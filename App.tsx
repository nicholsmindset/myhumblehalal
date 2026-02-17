import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { initializeDatabase } from './services/db';

const HomePage = lazy(() => import('./pages/HomePage'));
const DirectoryPage = lazy(() => import('./pages/DirectoryPage'));
const DirectoryMapView = lazy(() => import('./pages/DirectoryMapView'));
const BusinessDetailPage = lazy(() => import('./pages/BusinessDetailPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const SubmitBusinessPage = lazy(() => import('./pages/SubmitBusinessPage'));
const SubmitEventPage = lazy(() => import('./pages/SubmitEventPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AdvertisePage = lazy(() => import('./pages/AdvertisePage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const CategoryExplorerPage = lazy(() => import('./pages/CategoryExplorerPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const HalalLivingPage = lazy(() => import('./pages/HalalLivingPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
);

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

// Initialize seed data on first visit
initializeDatabase();

// ⚠️ DEMO ONLY — Remove or replace with real auth (e.g. Supabase Auth) before production.
const PASSWORDS_KEY = 'hb_passwords';
if (!localStorage.getItem(PASSWORDS_KEY)) {
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify({
        'admin@humblehalal.sg': 'admin123',
        'ahmad@example.com': 'password123',
        'owner@example.com': 'owner123',
    }));
}

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <HashRouter>
                    <ScrollToTop />
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-grow">
                            <Suspense fallback={<PageLoader />}>
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/directory" element={<DirectoryPage />} />
                                    <Route path="/map" element={<DirectoryMapView />} />
                                    <Route path="/categories" element={<CategoryExplorerPage />} />
                                    <Route path="/business/:id" element={<BusinessDetailPage />} />
                                    <Route path="/review/:id" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
                                    <Route path="/events" element={<EventsPage />} />
                                    <Route path="/event/:id" element={<EventDetailPage />} />
                                    <Route path="/submit-business" element={<ProtectedRoute><SubmitBusinessPage /></ProtectedRoute>} />
                                    <Route path="/submit-event" element={<ProtectedRoute><SubmitEventPage /></ProtectedRoute>} />
                                    <Route path="/about" element={<AboutPage />} />
                                    <Route path="/support" element={<SupportPage />} />
                                    <Route path="/living" element={<HalalLivingPage />} />
                                    <Route path="/privacy" element={<PrivacyPage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/advertise" element={<AdvertisePage />} />
                                    <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                                    <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>} />
                                    <Route path="*" element={<NotFoundPage />} />
                                </Routes>
                            </Suspense>
                        </main>
                        <Footer />
                    </div>
                </HashRouter>
            </AuthProvider>
        </ErrorBoundary>
    );
};

export default App;
