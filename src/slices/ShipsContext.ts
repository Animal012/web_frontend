import React, { createContext, useContext, useState, FC } from 'react';

// Тип для строки поиска
interface ShipsContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

// Контекст для хранения строки поиска
const ShipsContext = createContext<ShipsContextType | undefined>(undefined);

// Провайдер для контекста
const ShipsProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");

    return (
        <ShipsContext.Provider value={{ searchQuery, setSearchQuery }}>
            {children}
        </ShipsContext.Provider>
    );
};

export const useShipsContext = () => {
    const context = useContext(ShipsContext);
    if (!context) {
        throw new Error("useShipsContext must be used within a ShipsProvider");
    }
    return context;
};
