import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="main-header flex items-center">
      <div className="text-white text-2xl font-thin">
        <Link to="/">
          <span className="font-bold">RR Racing</span> Company
        </Link>
      </div>
    </header>
  );
}
