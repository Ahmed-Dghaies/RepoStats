/* eslint-disable @typescript-eslint/no-empty-object-type */
import {} from "@material-tailwind/react";
import React from "react";

type EventCapture = {
  onPointerEnterCapture?: React.PointerEventHandler<any>;
  onPointerLeaveCapture?: React.PointerEventHandler<any>;
  placeholder?: string;
};

declare module "@material-tailwind/react" {
  export interface ButtonProps extends EventCapture {}
  export interface CardProps extends EventCapture {}
  export interface CardHeaderProps extends EventCapture {}
  export interface CardBodyProps extends EventCapture {}
  export interface DialogBodyProps extends EventCapture {}
  export interface DialogFooterProps extends EventCapture {}
  export interface DialogHeaderProps extends EventCapture {}
  export interface InputProps extends EventCapture {}
  export interface AvatarProps extends EventCapture {}
}
