/* eslint-disable jsx-a11y/anchor-is-valid */
import { AuthError, Session, User, WeakPassword } from "@supabase/supabase-js";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useState, type FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Urls } from "../../App";
import setToken from "../../helpers/auth/setToken";
import { supabase } from "../../supabase";

type Inputs = {
  email: string;
  password: string;
};

type SignInData =
  | {
      user: User;
      session: Session;
      weakPassword?: WeakPassword | undefined;
    }
  | {
      user: null;
      session: null;
      weakPassword?: null | undefined;
    };

type SignInParams = {
  data: Inputs;
  onSignIn: (data: SignInData) => void;
  onAuthError: (error: AuthError) => void;
};

const SignInPage: FC = function () {
  const signIn = async (params: SignInParams) => {
    const { email, password } = params.data;
    const { onSignIn, onAuthError } = params;
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      onAuthError(error);
      return;
    }

    if (data.user && data.session) {
      onSignIn(data);
      return;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [isAuthError, setIsAuthError] = useState(false);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    signIn({
      data: data,
      onSignIn: (data: SignInData) => {
        const { session } = data;
        if (!session) throw new Error("Session not found");
        setToken("accessToken", session?.access_token);
        setToken("refreshToken", session?.refresh_token);
        navigate(Urls.ROOT);
      },
      onAuthError: (error: AuthError) => {
        console.error(error);
        setIsAuthError(true);
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <a href="/" className="my-6 flex items-center gap-x-1 lg:my-0">
        <img
          alt="Flowbite logo"
          src="https://flowbite.com/docs/images/logo.svg"
          className="mr-3 h-10"
        />
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          PT Perancah Pro Alat Dashboard
        </span>
      </a>
      <Card
        horizontal
        imgSrc="/images/authentication/login.jpg"
        imgAlt=""
        className="w-full md:max-w-[1024px] md:[&>*]:w-full md:[&>*]:p-16 [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Sign in
        </h1>
        {isAuthError && (
          <span className="font-medium text-red-600">
            Email or password entered is incorrect
          </span>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="email">Your email</Label>
            <TextInput
              {...register("email", { required: true })}
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
              color={errors.email && "failure"}
              helperText={
                errors.email && (
                  <span className="font-medium">Invalid email</span>
                )
              }
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Your password</Label>
            <TextInput
              {...register("password", { required: true })}
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              color={errors.password && "failure"}
              helperText={
                errors.password && (
                  <span className="font-medium">Invalid password</span>
                )
              }
            />
          </div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <Checkbox id="rememberMe" name="rememberMe" />
              <Label htmlFor="rememberMe">Remember me</Label>
            </div>
            <a
              href="/authentication/contact-admin"
              className="w-1/2 text-right text-sm text-primary-600 dark:text-primary-300"
            >
              Lost Password?
            </a>
          </div>
          <div className="mb-6">
            <Button type="submit" className="w-full lg:w-auto">
              Login to your account
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Not registered?&nbsp;
            <a
              href="/authentication/contact-admin"
              className="text-primary-600 dark:text-primary-300"
            >
              Create account
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;
