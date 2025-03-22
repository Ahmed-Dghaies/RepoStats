import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import React from "react";
import TextInput from "../fields/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface ActionParams {
  icon: IconProp;
  onClick: () => void;
  tip: string;
}

interface SearchParams {
  value: string;
  onChange: (data?: any) => void;
  placeholder: string;
  fieldWidth?: string;
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
    <Card className={className}>
      <CardHeader
        variant="gradient"
        color="gray"
        className="mb-4 p-6 flex justify-between flex-shrink-0"
      >
        <Typography variant="h6" color="white">
          <div>{title}</div>
        </Typography>
        <div className="flex gap-3">
          {searchParams && (
            <TextInput
              value={searchParams.value}
              onChange={(value) => searchParams.onChange(value)}
              icon={<FontAwesomeIcon icon={faSearch} />}
              placeholder={searchParams.placeholder}
              width={searchParams.fieldWidth ?? "w-full"}
            />
          )}
          {actionParams && (
            <div
              className="h-full flex items-center"
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
      <CardBody className={bodyClassName}>{children ?? ""}</CardBody>
    </Card>
  );
};

export default MyCard;
