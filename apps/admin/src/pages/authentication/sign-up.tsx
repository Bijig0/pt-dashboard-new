/* eslint-disable jsx-a11y/anchor-is-valid */
import { Card } from "flowbite-react";
import type { FC } from "react";

const SignUpPage: FC = function () {
  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <a href="/" className="my-6 flex items-center gap-x-1 lg:my-0">
        <img
          alt="Flowbite logo"
          src="https://flowbite.com/docs/images/logo.svg"
          className="mr-3 h-10"
        />
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          PT Perancah Pro Alat
        </span>
      </a>
      <Card
        horizontal
        imgSrc="/images/authentication/create-account.jpg"
        imgAlt=""
        className="w-full md:max-w-[1024px] md:[&>*]:w-full md:[&>*]:p-16 [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Please contact the administrative team for assistance <br /> <br />
          admin@ptperancahproalat.com
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          <a
            href="/authentication/sign-in"
            className="text-primary-600 dark:text-primary-200"
          >
            Back to sign in page
          </a>
        </p>
      </Card>
    </div>
  );
};

export default SignUpPage;
