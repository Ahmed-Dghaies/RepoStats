import { Repository } from "@/types/repository";
import backendApi from "@/utils/axios/axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useValidateRepository = ({ owner, repository }: Partial<Repository>) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!owner || !repository) return;

    const checkRepository = async () => {
      try {
        await backendApi.get(`/repository/${owner}/${repository}/details`).catch((error: any) => {
          console.error(error);
          navigate("/404", { replace: false });
        });
      } catch (err) {
        console.error(err);
        navigate("/404", { replace: false });
      }
    };

    checkRepository();
  }, [owner, repository, navigate]);
};

export default useValidateRepository;
