import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FriendForm from './pages/FriendForm';
import { FriendProvider } from './context/FriendContext';

function App() {
    return (
        <FriendProvider>
            <Router>
                <div className="min-h-screen bg-white text-text-primary font-sans antialiased">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/friend-form" element={<FriendForm />} />
                    </Routes>
                </div>
            </Router>
        </FriendProvider>
    );
}

export default App;
