'use client';
import { useState } from "react";

export const useToggleNav = (initialState: boolean = false) => {
    const [isNavOpen, setIsNavOpen] = useState(initialState); 
    const toggleNav = () => setIsNavOpen(prev => !prev);

    return { isNavOpen, toggleNav };
}