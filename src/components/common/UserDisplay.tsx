import { Avatar, Typography } from "@material-tailwind/react";

const UserDisplay = ({
  image,
  name,
  email,
  className,
}: {
  image: string;
  name: string;
  email?: string;
  className?: string;
}) => {
  console.log(image, name, email, className);
  return (
    <div className={`flex items-center gap-x-3 ${className}`}>
      <Avatar size="sm" src={image} alt={name} />
      <div>
        <Typography color="blue-gray" variant="h6">
          {name}
        </Typography>
        {email && (
          <Typography variant="small" color="gray">
            {email}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default UserDisplay;
