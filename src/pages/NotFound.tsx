
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - GetYoVids.com</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to GetYoVids.com to download and convert videos for free." />
      </Helmet>

      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <NavLink to="/">
          <Button size="lg">
            Return to Home
          </Button>
        </NavLink>
      </div>
    </>
  );
};

export default NotFound;
