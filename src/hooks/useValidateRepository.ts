import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface useValidateRepositoryProps {
  owner: string | undefined;
  repository: string | undefined;
}

const useValidateRepository = ({
  owner,
  repository,
}: useValidateRepositoryProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!owner || !repository) return;

    const checkRepository = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repository}`
        );
        if (!response.ok) {
          navigate("/404", { replace: true });
        }
      } catch (err) {
        console.error(err);
        navigate("/404", { replace: true });
      }
    };

    checkRepository();
  }, [owner, repository, navigate]);
};

export default useValidateRepository;
