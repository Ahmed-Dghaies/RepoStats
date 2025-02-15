import { Input, Typography } from "@material-tailwind/react";
import { ReactNode } from "react";

interface TextInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
  placeholder?: string;
  labelClassName?: string;
  containerClassName?: string;
  width?: string;
  errorMessage?: string;
}

const TextInput = ({
  label,
  value,
  onChange,
  icon,
  placeholder,
  labelClassName,
  containerClassName,
  width,
  errorMessage,
}: TextInputProps) => {
  return (
    <>
      {label && <Typography className="text-sm">{label}</Typography>}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon={icon}
        label={placeholder}
        className={`${width} !border !border-gray-300`}
        labelProps={{
          className: `before:content-none after:content-none peer-focus:invisible pl-3 transition-none ${labelClassName} ${width}`,
        }}
        crossOrigin={undefined}
        containerProps={{ className: `${containerClassName} ${width}` }}
      />
      {errorMessage && (
        <Typography color="red" className="pl-1 text-sm">
          {errorMessage}
        </Typography>
      )}
    </>
  );
};

export default TextInput;
