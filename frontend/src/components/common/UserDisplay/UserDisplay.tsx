import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  return (
    <div className={`flex items-center gap-x-3 ${className}`}>
      <Avatar className="w-sm">
        <AvatarImage src={image} />
        <AvatarFallback>name</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-bold text-lg text-slate-800">{name}</div>
        {email && <div className="text-sm text-slate-600">{email}</div>}
      </div>
    </div>
  );
};

export default UserDisplay;
