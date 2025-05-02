import constructionWorker from "./images/construction-worker.svg";
import underConstructionSign from "./images/under-construction.svg";

const UnderConstruction = ({ content }: { content: string }) => {
  return (
    <div className="w-full overflow-y-auto flex justify-center items-center p-5">
      <div className="hidden sm:block">
        <img
          src={constructionWorker}
          className="w-3xs min-w-3xs md:w-2xs lg:w-xs md:min-w-2xs lg:min-w-xs "
        />
      </div>
      <div className="flex gap-3 flex-col">
        <div className="flex justify-center">
          <img src={underConstructionSign} className="w-sm" />
        </div>
        <div className="flex flex-col">
          <div className="text-2xl font-bold text-center">Work in progress: {content}</div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
