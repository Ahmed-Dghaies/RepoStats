import { Card } from "@/components/Common";
import { useEffect, useState } from "react";
import { Contributor, Repository } from "@/types/repository";
import { fetchRepositoryContributors } from "@/features/repositories/services/repositories";
import LoadingOverlay from "@achmadk/react-loading-overlay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RepositoryContributors = ({ owner, repository }: Partial<Repository>) => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!owner || !repository) return;
    const fetchContributors = async () => {
      setLoading(true);
      await fetchRepositoryContributors({ owner, repository }).then((response) => {
        setContributors(response);
        setLoading(false);
      });
    };

    fetchContributors();
  }, [owner, repository]);

  return (
    <Card
      title="Contributors"
      className="w-full sm:w-1/2 h-[300px] flex flex-col"
      bodyClassName="pr-0 pl-2 overflow-y-auto mr-2 mb-2 divide-y divide-gray-200 py-0 flex-grow"
    >
      <LoadingOverlay
        active={loading}
        spinner
        text="Loading contributors..."
        className="h-full w-full overflow-x-hidden pr-1 flex-grow min-h-full"
      >
        {contributors.map(({ login, email, contributions, avatarUrl }) => (
          <div
            key={login}
            className="flex items-center justify-between pb-3 pt-3 last:pb-0 first:pt-0"
          >
            <div className="flex items-center gap-x-3">
              <Avatar>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{login}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-md text-slate-800">{login}</div>
                {email && <div className="text-sm text-slate-600">{email}</div>}
              </div>
            </div>
            <div className="font-bold text-lg text-slate-800">{contributions}</div>
          </div>
        ))}
      </LoadingOverlay>
    </Card>
  );
};

export default RepositoryContributors;
