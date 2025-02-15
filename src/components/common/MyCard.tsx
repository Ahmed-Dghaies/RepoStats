import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
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
  searchParams?: SearchParams;
  actionParams?: ActionParams;
  children: React.ReactNode;
}

const MyCard = ({
  title,
  searchParams,
  actionParams,
  children,
}: MyCardProps) => {
  return (
    <Card className="w-full lg:w-3/4 mt-3">
      <CardHeader
        variant="gradient"
        color="gray"
        className="mb-8 p-6 flex justify-between"
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
              data-tooltip-content="Add Repository"
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
      <CardBody className="overflow-hidden px-0 pt-0 pb-2 h-[400px] max-h-[400px] mx-2 flex flex-col">
        {children}
      </CardBody>
    </Card>
  );
};

export default MyCard;
