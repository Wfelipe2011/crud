import { Link } from "react-router-dom";

export interface IconButtonProps {
  id?: string;
  url?: any;
  text?: string;
  icon?: any;
  title?: boolean;
  className?: string;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseOut?: (event: any) => void;
  hiddenArial?: boolean;
}

function IconButton(props: IconButtonProps) {
  function renderLink() {
    return (
      <div className={`linkContainer`}>
        {props.icon}
        {props.text && <span className="LinkText">{props.text}</span>}
      </div>
    );
  }
  return (
    <>
      {props.hiddenArial ? (
        <li
          onClick={props.onClick}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseOut}
          className={`list-none px-2 py-2 ${props.className}`}
        >
          {" "}
          {props.url ? (
            <Link to={props.url} type="submit">
              {renderLink()}
            </Link>
          ) : (
            renderLink()
          )}
        </li>
      ) : (
        <li
          aria-label={props.text}
          onClick={props.onClick}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseOut}
          // onMouseOut={props.onMouseOut}
          className={`list-none px-2 py-2 ${props.className}`}
        >
          {" "}
          {props.url ? (
            <Link to={props.url} type="submit">
              {renderLink()}
            </Link>
          ) : (
            renderLink()
          )}
        </li>
      )}
    </>
  );
}

export default IconButton;
