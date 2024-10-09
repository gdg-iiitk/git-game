"use client";

import axios from "axios";

import { useState } from "react";

export default function LoginCard({ setLoggedIn }) {
  const [errorMessage, setErrorMessage] = useState("This is an error message");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [realName, setRealName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    if (userName === "" || email === "" || realName === "") {
      setErrorMessage("Please fill all the fields");
      return;
    } else if (!email.includes("@iiitkottayam.ac.in")) {
      setErrorMessage("Please enter a valid IIIT Kottayam email");
      return;
    } else if (userName.includes(" ")) {
      setErrorMessage("GitHub Username should not contain spaces");
      return;
    } else {
      setErrorMessage("Proceeding");
      // checking if the user exist

      try {
        await axios
          .get(`/api/v1/doesUserExist?user=${userName}`)
          .then((res) => {
            console.log(res);
            // This is a wrong way to check if the user exists
            // This is just a dummy code
            if (res.data.status === 200 && res.data.success === true) {
              localStorage.setItem("user", userName);
              localStorage.setItem("realName", realName);
              setLoggedIn(true);

              // Proceed to next step
            } else if (res.data.status === 200 && res.data.success === false) {
              setErrorMessage("User Doesn't Exist!");
            }
          });
      } catch (error) {
        setErrorMessage("Error Connecting to Backend");
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    /* From Uiverse.io by adamgiebl */
    <div className=" w-[450px] h-[500px] my-4 card">
      <div className="Heading text-xl  font-bold text-center py-5 my-2">
        Login with your Github UserName
      </div>
      <div className="inputField flex flex-col items-center justify-center gap-5  mx-5 w-[80%] mx-auto">
        <div className="input1 w-full px-6">
          <div className="label text-xs font-bold w-full">Github UserName</div>
          <input
            type="text"
            placeholder="Ivide thanne"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border border-gray-500 p-2  rounded-md my-2 w-full  bg-transparent border-opacity-70 "
          />
        </div>

        <div className="input1 w-full px-6 ">
          <div className="label text-xs font-bold w-full">College Email</div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="College Email id"
            className="border border-gray-500 p-2  rounded-xl my-2 w-full bg-transparent border-opacity-70"
          />
        </div>
        <div className="input1 w-full px-6">
          <div className="label text-xs font-bold w-full">Your Real Name</div>
          <input
            type="text"
            value={realName}
            onChange={(e) => setRealName(e.target.value)}
            placeholder="Kimi no Na wa"
            className="border border-gray-500 p-2  rounded-xl my-2 w-full bg-transparent border-opacity-70"
          />
        </div>
        <button
          className="button w-3 hover:bg-blue-600"
          onClick={handleProceed}
        >
          Proceed
        </button>
        <div className="ErrorText text-sm text-red-500 font-light">
          {errorMessage}
        </div>
      </div>
    </div>
  );
}
