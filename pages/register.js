import { registerRoute } from "@/utils/APIRoutes";
import validate from "@/utils/validations";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const router = useRouter();

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value });
    const errorList = validate(name, value, errors);
    setErrors(errorList);
  }

  const handleRegister = async () => {
    const { name } = validate("name", formData.name, errors);
    const { email } = validate("email", formData.email, errors);
    const { password } = validate("password", formData.password, errors);

    setErrors({ name, email, password });
    if (Object.keys(errors).length) return;

    console.log(formData, "formData");

    const { data } = await axios.post(registerRoute, formData);
    if (data.status === false) {
      toast.error(data.msg, toastOptions);
    } else {
      localStorage.setItem("chat-app-user", JSON.stringify(data.user));
    }
    router.push("/");
  };

  return (
    <div className="container mb-8 mt-32">
      <div className="flex flex-col md:flex-row w-4/5 mx-auto border border-gray-300 rounded-xl">
        <div className="hidden md:flex">
          <Image
            className="rounded-xl"
            src="/assets/chat.avif"
            alt="login-image"
            width={450}
            height={600}
          />
        </div>
        <div className="form">
          <h2 className="text-center text-2xl mb-10">Register</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              className="form-control"
              name="name"
              value={formData?.name || ""}
              onChange={(event) => handleChange(event)}
            />
            {errors.name && (
              <span className="text-sm ml-2 text-red-600">{errors.name}</span>
            )}
          </div>
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
              <span className="text-sm ml-2 text-red-600">{errors.email}</span>
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
              <span className="text-sm ml-2 text-red-600">
                {errors.password}
              </span>
            )}
          </div>
          <div className="bg-gray-800 text-white w-5/6 mx-auto my-5 rounded-xl text-center">
            <button
              type="button"
              className="p-1 md:px-3 md:py-2 w-full"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
          <div className="w-5/6 mx-auto text-center text-sm mb-5 flex flex-col">
            <Link href="/login" className="underline text-blue-500">
              Login Email & Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
