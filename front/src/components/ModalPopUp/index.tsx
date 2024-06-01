import { ReactNode } from "react";
import "./index.css";
import { XIcon } from "lucide-react";

interface ModalPopUpProps {
  status: boolean;
  title?: string | ReactNode;
  text?: string | ReactNode;
  onClickCancel: (value: boolean) => void;
  children: ReactNode;
  className?: string;
  listRender?: any;
  classNameTitle?: string;
  classNameChildren?: string;
  classNameGrandson?: string;
}

export function ModalPopUp({
  status,
  title,
  text,
  onClickCancel,
  children,
  className,
  classNameTitle,
  classNameChildren,
  classNameGrandson,
}: ModalPopUpProps) {
  return (
    <>
      {status && (
        <>
          <div
            className="fixed w-screen z-10 h-screen left-0 top-0 bg-black bg-opacity-50"
            onClick={() => onClickCancel(!status)}
          ></div>
          <div
            className={`absolute bg-white py-4 px-8 flex flex-col rounded-md z-20 inset-1/2 transform -translate-x-1/2 -translate-y-1/2 ${className}`}
          >
            {title && (
              <div className={`box-shadow title-modal ${classNameTitle}`}>
                {title}
              </div>
            )}
            {/* <IconButton
              className="iconX"
              icon={X}
              onClick={() => onClickCancel(!status)}
            /> */}
            <XIcon className="iconX" onClick={() => onClickCancel(!status)} />
            <div className={classNameChildren}>
              <div className="modalPopUpHeaderContainer">{text}</div>
              <div className={`modalPopUpBodyContainer ${classNameGrandson}`}>
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
