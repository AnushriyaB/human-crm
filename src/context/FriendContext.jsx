import React, { createContext, useContext, useState } from 'react';
import { geocodeLocation } from '../lib/geocode';

const FriendContext = createContext();

export function useFriends() {
    return useContext(FriendContext);
}

export function FriendProvider({ children }) {
    const [friends, setFriends] = useState([
        {
            id: 'me',
            name: 'me',
            lat: null,
            lon: null,
            location: '',
            isMe: true,
            photo: null,
            passphrase: 'demo',
            birthday: '',
            // Demo modules already added for "me"
            modules: [
                {
                    type: 'family',
                    data: {
                        partner: { name: '', anniversary: '' },
                        children: [],
                        pets: []
                    }
                },
                {
                    type: 'dates',
                    data: {
                        dates: []
                    }
                },
                {
                    type: 'preferences',
                    data: {
                        favorites: {
                            food: '',
                            color: '',
                            music: '',
                            hobbies: '',
                            giftIdeas: ''
                        }
                    }
                },
                {
                    type: 'memories',
                    data: {
                        howWeMet: '',
                        favoriteMemory: '',
                        firstMeeting: '',
                        notes: ''
                    }
                }
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
            // New friends get starter modules
            modules: [
                { type: 'family', data: { partner: { name: '', anniversary: '' }, children: [], pets: [] } },
                { type: 'dates', data: { dates: [] } },
                { type: 'preferences', data: { favorites: {} } }
            ]
        };
        setFriends(prev => [...prev, newFriend]);
    };

    const updateFriend = async (id, updates) => {
        const currentFriend = friends.find(f => f.id === id);
        if (!currentFriend) return;

        const locationQuery = updates.address || updates.city || currentFriend.address || currentFriend.city;

        // Only geocode if location changed OR if it was missing coords before
        const locationChanged = (updates.address && updates.address !== currentFriend.address) ||
            (updates.city && updates.city !== currentFriend.city);

        const needsCoords = (locationQuery && (currentFriend.lat === null || currentFriend.lon === null)) || locationChanged;

        let newCoords = {};

        if (needsCoords && locationQuery) {
            const preciseCoords = await geocodeLocation(locationQuery);
            if (preciseCoords) {
                newCoords = preciseCoords;
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
