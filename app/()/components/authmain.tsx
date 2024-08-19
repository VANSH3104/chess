"use client";
import { FaRegChessQueen } from "react-icons/fa6";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Social } from "./authsocial";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Var = "LOGIN" | "REGISTER";
type FormValues = {
  email: string;
  password: string;
  name?: string;
};

export const Authmain = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [variable, setVariable] = useState<Var>("LOGIN");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const toggle = () => {
    setVariable((prev) => (prev === "LOGIN" ? "REGISTER" : "LOGIN"));
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    if (variable === "REGISTER") {
      axios
        .post(`/api/register`, data)
        .then(() => signIn("credentials", { email: data.email, password: data.password }))
        .catch(() => toast.error("Something went wrong"))
        .finally(() => setLoading(false));
    } else {
      signIn("credentials", { ...data, redirect: false })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid Credentials");
          } else {
            toast.success("Login Successful");
            router.push("/dashboard");
          }
        })
        .finally(() => setLoading(false));
    }
  };

  const clicking = (action: string) => {
    setLoading(true);
    signIn(action, {redirect: false }).then((callback) => {
      if (callback?.error) {
        toast.error("Invalid Credentials");
      } else {
        toast.success("Login Successful");
        router.push("/dashboard");
      }
    }).finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-6xl font-serif font-bold text-white text-center pb-6">
        <div className="flex">
          Chess
          <FaRegChessQueen className="pl-2 text-4xl" />
        </div>
      </div>
      <div className="bg-slate-100 opacity-90 rounded-xl">
        <Card>
          <CardHeader />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="pl-4 pr-4 rounded">
              {variable === "REGISTER" && (
                <div className="pb-3">
                  <Input
                    className="rounded-xl"
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    {...register("name", { required: variable === "REGISTER" })}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
              )}
              <div className="pb-3">
                <Input
                  className="rounded-xl"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Email is invalid.",
                    },
                  })}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div className="pb-3">
                <Input
                  className="rounded-xl"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required.",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters.",
                    },
                  })}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
              <button type="submit" className="mt-2 bg-gray-700 text-white py-2 w-full rounded hover:bg-gray-600">
                {loading ? "Loading..." : variable === "LOGIN" ? "Login" : "Register"}
              </button>
            </form>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t mt-3 border-gray-300 flex"></div>
              <span className="pt-4 mx-4 text-lg text-gray-500">or</span>
              <div className="flex-grow border-t mt-3 border-gray-300"></div>
            </div>
            <div className="mt-6 flex justify-center gap-7 pl-2">
              <Social icon={BsGithub} onclick={() => clicking("github")} />
              <Social icon={BsGoogle} onclick={() => clicking("google")} />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-center pl-4">
              <button onClick={toggle} className="text-gray-500 text-sm underline">
                {variable === "LOGIN" ? "Don't have an account? Register" : "Already have an account? Login"}
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
