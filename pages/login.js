import { loginRoute } from "@/utils/APIRoutes";
import validate from "@/utils/validations";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Login() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      router.push("/");
    }
  });

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value });
    const errorList = validate(name, value, errors);
    setErrors(errorList);
  }

  async function handleLogin(e) {
    e.preventDefault();
    let errors = {};
    errors = validate("email", formData.email, errors);
    errors = validate("password", formData.password, errors);
    setErrors({ ...errors });
    if (Object.keys(errors).length) return;
    const { data } = await axios.post(loginRoute, formData);
    if (data.status === false) {
      toast.error(data.msg, toastOptions);
      return;
    } else {
      localStorage.setItem("chat-app-user", JSON.stringify(data.user));
    }
    router.push("/");
  }

  return (
    <div className="container mb-8 mt-32">
      <div className="flex flex-col md:flex-row w-full md:w-4/5 mx-auto border border-gray-300 rounded-xl">
        <div className="hidden md:flex">
          <Image
            className="rounded-xl"
            src="/assets/chat.avif"
            alt="login-image"
            width={450}
            height={600}
          />
        </div>
        <form className="form">
          <h2 className="text-center text-2xl mb-10">Login</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Email Address"
              className="form-control"
              name="email"
              value={formData?.email || ""}
              onChange={(event) => handleChange(event)}
            />
            {errors.email && (
              <span className="text-sm ml-2 text-red-500">{errors.email}</span>
            )}
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              name="password"
              value={formData?.password || ""}
              onChange={(event) => handleChange(event)}
            />
            {errors.password && (
              <span className="text-sm ml-2 text-red-500">
                {errors.password}
              </span>
            )}
          </div>
          <div className="bg-gray-800 text-white w-5/6 mx-auto my-5 rounded-xl text-center">
            <button
              className="p-1 md:px-3 md:py-2 w-full"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
          <div className="w-2/3 mx-auto text-center text-sm mb-5 flex flex-col">
            <div className="mb-5">
              {/* <Link href="/forget-password" className="mr-2">
                Lost your password?
              </Link>
              | */}
              <span>Dont have account ?</span>
              <Link href="/register" className="ml-2 text-blue-500">
                Register with Email
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
