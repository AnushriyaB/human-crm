import React, { createContext, useContext, useState } from 'react';

const FriendContext = createContext();

export function useFriends() {
    return useContext(FriendContext);
}

export function FriendProvider({ children }) {
    const [friends, setFriends] = useState([]);

    const addFriend = (friend) => {
        setFriends([...friends, { ...friend, id: Date.now().toString() }]);
    };

    return (
        <FriendContext.Provider value={{ friends, addFriend }}>
            {children}
        </FriendContext.Provider>
    );
}
