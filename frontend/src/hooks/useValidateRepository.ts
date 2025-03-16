import { Repository } from "@/types/repository";
import backendApi from "@/utils/axios/axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useValidateRepository = ({ owner, name }: Partial<Repository>) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!owner || !name) return;

    const checkRepository = async () => {
      try {
        await backendApi.get(`/repository/${owner}/${name}/details`).catch((error: any) => {
          console.log(error);
          navigate("/404", { replace: false });
        });
      } catch (err) {
        console.error(err);
        navigate("/404", { replace: false });
      }
    };

    checkRepository();
  }, [owner, name, navigate]);
};

export default useValidateRepository;
