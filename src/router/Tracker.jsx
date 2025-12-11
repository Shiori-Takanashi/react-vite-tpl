// src/router/Tracker.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "../hooks/useHistory";

export function Tracker() {
    const location = useLocation();
    const { add } = useHistory();

    useEffect(() => {
        add(location.pathname);
    }, [add, location.pathname]);

    return null;
}
