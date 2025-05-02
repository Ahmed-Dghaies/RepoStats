import { Repository } from "@/types/repository";
import { useEffect, useState } from "react";

const useRepositories = () => {
  const [repositories, setRepositories] = useState<Repository[]>(() =>
    JSON.parse(localStorage.getItem("repositories") ?? "[]")
  );

  useEffect(() => {
    const handler = (e: CustomEvent<Repository[]>) => {
      setRepositories(e.detail);
    };
    window.addEventListener("repositoriesUpdated", handler as EventListener);
    return () => window.removeEventListener("repositoriesUpdated", handler as EventListener);
  }, []);

  return repositories;
};

export default useRepositories;
