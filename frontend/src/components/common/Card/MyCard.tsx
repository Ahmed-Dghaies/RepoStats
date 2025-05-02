import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";

interface ActionParams {
  icon: IconProp;
  onClick: () => void;
  tip: string;
}

interface SearchParams {
  value: string;
  onChange: (data?: any) => void;
  placeholder: string;
  className?: string;
  containerClassName?: string;
}

interface MyCardProps {
  title: string;
  className?: string;
  bodyClassName?: string;
  searchParams?: SearchParams;
  actionParams?: ActionParams;
  children: React.ReactNode;
}

const MyCard = ({
  title,
  className,
  bodyClassName,
  searchParams,
  actionParams,
  children,
}: MyCardProps) => {
  return (
    <Card className={`${className} py-3 gap-6`}>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="pr-2 text-xl">{title}</CardTitle>
        <div className="flex gap-3">
          {searchParams && (
            <div className="relative">
              <Input
                value={searchParams.value}
                onChange={(e) => searchParams.onChange(e.target.value)}
                placeholder={searchParams.placeholder}
                className={`pr-10 ${searchParams.className ?? "w-full"}`}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5"
              />
            </div>
          )}
          {actionParams && (
            <div
              className="flex items-center"
              data-tooltip-content={actionParams.tip}
              data-tooltip-id="global-tooltip"
            >
              <FontAwesomeIcon
                icon={actionParams.icon}
                className="color-white hover:cursor-pointer text-xl font-bold"
                onClick={actionParams.onClick}
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className={bodyClassName}>{children ?? ""}</CardContent>
    </Card>
  );
};

export default MyCard;
