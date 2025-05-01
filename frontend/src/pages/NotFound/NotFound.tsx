import avatar from "@/assets/images/avatar.svg";
import notFound from "@/assets/images/not-found.svg";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full overflow-y-auto flex justify-center items-center p-5">
      <div className="flex flex-col gap-3 lg:w-2/3">
        <div className="flex justify-center">
          <img src={notFound} className="w-sm" />
        </div>
        <div className="flex gap-3">
          <div className="hidden sm:block">
            <img src={avatar} className="w-xs min-w-xs" />
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-justify">
              Something went wrong! The page or the repository you were looking for does not exist.
              sorry for the inconvenience
            </div>
            <div className="mt-3 flex justify-center flex-grow items-center">
              <Link to="/">
                <Button
                  variant="gradient"
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
