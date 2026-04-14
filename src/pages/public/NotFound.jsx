import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center text-center">
      <div>
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2">Page not found</p>
        <Link to="/" className="mt-4 inline-block text-brand-600">Back to Home</Link>
      </div>
    </div>
  );
}

export default NotFound;
