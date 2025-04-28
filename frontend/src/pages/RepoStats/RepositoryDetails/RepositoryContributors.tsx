import { Card } from "@/components/Common";
import { Repository } from "@/types/repository";
import { Typography, Avatar } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Contributor } from "@/types/repository";
import { fetchRepositoryContributors } from "@/features/repositories/services/repositories";
import LoadingOverlay from "@achmadk/react-loading-overlay";

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
      className="w-full sm:w-1/2 h-[300px] mt-6 flex flex-col"
      bodyClassName="pr-0 pl-3 overflow-y-auto mr-2 mb-2 divide-y divide-gray-200 py-0 flex-grow"
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
              <Avatar size="sm" src={avatarUrl} alt="User" />
              <div>
                <Typography color="blue-gray" variant="h6">
                  {login}
                </Typography>
                {email && (
                  <Typography variant="small" color="gray">
                    {email}
                  </Typography>
                )}
              </div>
            </div>
            <Typography color="blue-gray" variant="h6">
              {contributions}
            </Typography>
          </div>
        ))}
      </LoadingOverlay>
    </Card>
  );
};

export default RepositoryContributors;
