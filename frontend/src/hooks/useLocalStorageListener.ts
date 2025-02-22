import { Repository } from "@/types/repository";
import { useState, useEffect } from "react";

const useLocalStorageListener = (key: string) => {
  const [value, setValue] = useState<Repository[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setValue(event.newValue ? JSON.parse(event.newValue) : []);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return value;
};

export default useLocalStorageListener;
