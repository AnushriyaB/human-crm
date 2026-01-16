import React, { createContext, useContext, useState } from 'react';

const FriendContext = createContext();

export function useFriends() {
    return useContext(FriendContext);
}

export function FriendProvider({ children }) {
    const [friends, setFriends] = useState([]);

    const addFriend = (friend) => {
        const hasLocation = friend.address || friend.city;
        const newFriend = {
            ...friend,
            id: Date.now().toString(),
            // Only assign coordinates if location exists
            x: hasLocation ? 20 + Math.random() * 60 : null, // keep away from edges
            y: hasLocation ? 20 + Math.random() * 60 : null
        };
        setFriends([...friends, newFriend]);
    };

    const updateFriend = (id, updates) => {
        setFriends(friends.map(f => {
            if (f.id !== id) return f;

            // Check if adding location to a friend who didn't have coordinates
            const nowHasLocation = updates.address || updates.city || f.address || f.city;
            const needsCoordinates = nowHasLocation && f.x === null;

            return {
                ...f,
                ...updates,
                x: needsCoordinates ? 20 + Math.random() * 60 : f.x,
                y: needsCoordinates ? 20 + Math.random() * 60 : f.y
            };
        }));
    };

    return (
        <FriendContext.Provider value={{ friends, addFriend, updateFriend }}>
            {children}
        </FriendContext.Provider>
    );
}
