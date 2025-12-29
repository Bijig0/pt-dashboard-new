import { useState } from "react";
import { FaArrowRight, FaChevronDown, FaChevronUp, FaCopy, FaRedo } from "react-icons/fa";
import { MdError } from "react-icons/md";

const defaultErrorMessage =
  "Something went wrong. Please contact the admin (Brady) for assistance";

type Props = {
  error?: Error;
  resetError?: () => void;
};

const ErrorScreen = (props: Props) => {
  const { error, resetError } = props;
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyError = () => {
    const errorInfo = `Error: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || 'No stack trace available'}
Time: ${new Date().toISOString()}
URL: ${window.location.href}`;

    navigator.clipboard.writeText(errorInfo).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRetry = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center min-h-screen px-4 py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="grid max-w-sm gap-6 mx-auto text-center sm:max-w-md md:gap-6 lg:gap-8 lg:max-w-2xl xl:max-w-3xl">
        <div className="space-y-4">
          <div className="flex justify-center">
            <MdError className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
            Uh oh! Something went wrong.
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {error?.message ?? defaultErrorMessage}
          </p>
        </div>

        {/* Error Details Section */}
        {error && (
          <div className="text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span>Error Details</span>
              {showDetails ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {showDetails && (
              <div className="px-4 pb-4 space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Error Message</p>
                  <p className="text-sm text-red-600 dark:text-red-400 font-mono bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    {error.message}
                  </p>
                </div>

                {error.stack && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Stack Trace</p>
                    <pre className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto max-h-48 overflow-y-auto">
                      {error.stack}
                    </pre>
                  </div>
                )}

                <button
                  onClick={handleCopyError}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaCopy className="w-3 h-3" />
                  {copied ? 'Copied!' : 'Copy Error Details'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-6 text-sm font-medium text-white shadow-sm gap-2 transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <FaRedo className="w-4 h-4" />
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 text-sm font-medium text-gray-900 dark:text-white shadow-sm gap-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
          >
            <FaArrowRight className="w-4 h-4" />
            Go to Home
          </a>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          If this error persists, please contact the admin with the error details above.
        </p>
      </div>
    </div>
  );
};

export default ErrorScreen;
