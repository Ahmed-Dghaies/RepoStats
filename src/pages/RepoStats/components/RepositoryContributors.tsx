import MyCard from "@/components/common/MyCard";
import { Repository } from "@/types/repository";
import { Typography, Avatar } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Contributor } from "../types/repository";
import { fetchRepositoryContributors } from "@/features/repositories/services/repositories";

const RepositoryContributors = ({ owner, name }: Partial<Repository>) => {
  const [contributors, setContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    fetchRepositoryContributors({ owner, name }).then(setContributors);
  }, [owner, name]);

  return (
    <MyCard
      title="Contributors"
      className="w-full sm:w-1/2 md:w-1/4 h-[300px] mt-3 flex flex-col"
      bodyClassName="px-3 overflow-y-auto mr-2 mb-2 divide-y divide-gray-200 py-0"
    >
      {contributors.map(({ login, email, contributions, avatarUrl }, index) => (
        <div
          key={index}
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
    </MyCard>
  );
};

export default RepositoryContributors;
