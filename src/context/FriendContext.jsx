import React, { createContext, useContext, useState, useCallback } from 'react';
import { geocodeLocation } from '../lib/geocode';

const FriendContext = createContext();

export function useFriends() {
    return useContext(FriendContext);
}

// Default modules for new friends
const DEFAULT_MODULES = [
    { type: 'family', data: {} },
    { type: 'timeline', data: {} },
    { type: 'favorites', data: {} }
];

export function FriendProvider({ children }) {
    const [friends, setFriends] = useState([
        {
            id: 'me',
            name: 'me',
            lat: null,
            lon: null,
            location: '',
            country: '',
            state: '',
            isMe: true,
            photo: null,
            passphrase: 'demo',
            nickname: '',
            pronouns: '',
            timezone: '',
            relationshipType: '',
            howMet: '',
            modules: [
                { type: 'family', data: {} },
                { type: 'timeline', data: {} },
                { type: 'favorites', data: {} },
                { type: 'story', data: {} }
            ]
        }
    ]);

    const addFriend = async (friend) => {
        const locationQuery = friend.address || friend.city;
        let coords = { lat: null, lon: null };

        if (locationQuery) {
            const preciseCoords = await geocodeLocation(locationQuery);
            if (preciseCoords) {
                coords = preciseCoords;
            }
        }

        const newFriend = {
            ...friend,
            id: Date.now().toString(),
            lat: coords.lat,
            lon: coords.lon,
            modules: DEFAULT_MODULES
        };
        setFriends(prev => [...prev, newFriend]);
    };

    // Synchronous update - no geocoding, instant update
    const updateFriend = useCallback((id, updates) => {
        setFriends(prev => prev.map(f => {
            if (f.id !== id) return f;
            return { ...f, ...updates };
        }));
    }, []);

    // Call this to geocode a specific location string for a friend
    const geocodeFriendLocation = useCallback(async (id, locationOverride) => {
        // Get current friend state
        const currentFriends = await new Promise(resolve => {
            setFriends(prev => {
                resolve(prev);
                return prev;
            });
        });

        const friend = currentFriends.find(f => f.id === id);
        if (!friend) return;

        // Use the override location if provided, otherwise use friend.location
        const locationToGeocode = locationOverride || friend.location;
        if (!locationToGeocode) return;

        const coords = await geocodeLocation(locationToGeocode);
        if (coords) {
            setFriends(prev => prev.map(f => {
                if (f.id !== id) return f;
                return { ...f, lat: coords.lat, lon: coords.lon };
            }));
        }
    }, []);

    return (
        <FriendContext.Provider value={{ friends, addFriend, updateFriend, geocodeFriendLocation }}>
            {children}
        </FriendContext.Provider>
    );
}
