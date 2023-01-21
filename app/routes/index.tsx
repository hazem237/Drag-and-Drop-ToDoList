import { LinksFunction } from "@remix-run/node";
import { Link } from "react-router-dom";
import stylesUrl from "~/styles/global.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  return (
    <div className="container">
      <div className="title-container">
        <h1>Swapy</h1>
        <h2>See your tasks done</h2>
      </div>
      <div className="btn-container">
        <Link to={"login"} className="button">
          LogIn
        </Link>
      </div>
    </div>
  );
}
