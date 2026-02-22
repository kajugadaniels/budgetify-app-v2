"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { syncUser } from "@/lib/actions/user";

function UserSync() {
    const { isSignedIn, isLoaded } = useUser();
    const hasSyncedRef = useRef(false);

    useEffect(() => {
        const handleUserSync = async () => {
            if (!isLoaded) return;

            if (!isSignedIn) {
                hasSyncedRef.current = false;
                return;
            }

            if (!hasSyncedRef.current) {
                try {
                    await syncUser();
                    hasSyncedRef.current = true;
                } catch (error) {
                    console.error("Failed to sync user", error);
                }
            }
        };

        handleUserSync();
    }, [isLoaded, isSignedIn]);

    return null;
}

export default UserSync;
