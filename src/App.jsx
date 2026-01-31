import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FriendForm from './pages/FriendForm';
import Join from './pages/Join';
import ThankYou from './pages/ThankYou';
import ButtonGallery from './pages/ButtonGallery';
import { FriendProvider } from './context/FriendContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <FriendProvider>
                <Router>
                    <div className="min-h-screen font-sans antialiased" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text-primary)' }}>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            <Route path="/join" element={<Join />} />
                            <Route path="/thank-you" element={<ThankYou />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/friend-form" element={<FriendForm />} />
                            <Route path="/buttons" element={<ButtonGallery />} />
                        </Routes>
                    </div>
                </Router>
            </FriendProvider>
        </ThemeProvider>
    );
}

export default App;
