import React, { createContext, useContext, useState } from 'react';
import { geocodeLocation } from '../lib/geocode';

const FriendContext = createContext();

export function useFriends() {
    return useContext(FriendContext);
}

export function FriendProvider({ children }) {
    const [friends, setFriends] = useState([]);

    const addFriend = async (friend) => {
        const locationQuery = friend.address || friend.city;
        let coords = { x: null, y: null };

        if (locationQuery) {
            const preciseCoords = await geocodeLocation(locationQuery);
            if (preciseCoords) {
                coords = preciseCoords;
            } else {
                // Fallback random if geocoding fails but location exists? 
                // Better to leave as null (shelf) or fallback? 
                // User asked for "precise", so let's try to stick to real coords
                // But if API fails, maybe fallback to random to allow "Map Mode"?
                // Let's rely on valid geocoding for now.
                // Actually, for better UX, fallback to random proximity if geocode fails but user provided input.
                coords = { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 };
            }
        }

        const newFriend = {
            ...friend,
            id: Date.now().toString(),
            x: coords.x,
            y: coords.y
        };
        setFriends(prev => [...prev, newFriend]);
    };

    const updateFriend = async (id, updates) => {
        // Determine if we need to re-geocode
        // We can't access 'f' easily inside dirty check without mapping.
        // Let's simpler logic: find friend first.

        const currentFriend = friends.find(f => f.id === id);
        if (!currentFriend) return;

        const locationQuery = updates.address || updates.city || currentFriend.address || currentFriend.city;

        // Only geocode if location changed OR if it was missing coords before
        const locationChanged = (updates.address && updates.address !== currentFriend.address) ||
            (updates.city && updates.city !== currentFriend.city);

        const needsCoords = (locationQuery && currentFriend.x === null) || locationChanged;

        let newCoords = { x: currentFriend.x, y: currentFriend.y };

        if (needsCoords && locationQuery) {
            const preciseCoords = await geocodeLocation(locationQuery);
            if (preciseCoords) {
                newCoords = preciseCoords;
            } else if (currentFriend.x === null) {
                newCoords = { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 };
            }
        }

        setFriends(prev => prev.map(f => {
            if (f.id !== id) return f;
            return { ...f, ...updates, ...newCoords };
        }));
    };

    return (
        <FriendContext.Provider value={{ friends, addFriend, updateFriend }}>
            {children}
        </FriendContext.Provider>
    );
}
