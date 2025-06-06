import { Button } from "@/components/ui/button";
import avatar from "./images/avatar.svg";
import notFound from "./images/not-found.svg";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full overflow-y-auto flex justify-center items-center p-5 pt-0">
      <div className="flex flex-col gap-3 lg:w-2/3">
        <div className="flex justify-center">
          <img src={notFound} alt="Page not found illustration" className="w-sm" />
        </div>
        <div className="flex gap-3">
          <div className="hidden sm:block">
            <img src={avatar} alt="Avatar illustration" className="w-xs min-w-xs" />
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-justify">
              Something went wrong! The page or the repository you were looking for does not exist.
              sorry for the inconvenience
            </div>
            <div className="mt-3 flex justify-center flex-grow items-center">
              <Link to="/">
                <Button
                  variant="default"
                  size="sm"
                  className="w-fit h-10 px-8 hover:cursor-pointer"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
