"use client";

import LoginCard from "@/components/LoginCard";
import Image from "next/image";
import gdgLogo from "../images/gdgLogo.png";
import sessionLogo from "../images/SessionLogo.png";
import TimeLine from "@/components/TimeLine";
import { useState } from "react";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [startLoader, setStartLoader] = useState(false);

  const logOut = () => {
    setLoggedIn(false);
    localStorage.clear();
  };

  return (
    <div className="h-screen background ">
      <div className="  flex items-center justify-between ">
        <div className="logo w-[14%] my-4 mx-4 ">
          {loggedIn && <Image src={gdgLogo} alt="Unable to load the logo" />}
        </div>
        {loggedIn && (
          <div className="Logout mx-4">
            <button
              onClick={logOut}
              className="bg-transparent hover:bg-neutral-200 font-semibold hover:text-black border-[1.5px] border-neutral-200 text-white  my-4 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      {!loggedIn && (
        <div className="mainBody flex item-center justify-evenly w-full h-[80%]">
          <div className="w-1/2 flex items-center justify-center">
            <div className="sessioLogo w-[80%] flex flex-col items-center justify-center  gap-6 h-full relative">
              <div className="logoGdg w-[40%] absolute top-0">
                <Image src={gdgLogo} alt="Unable to load the logo" />
              </div>

              <Image src={sessionLogo} alt="Unable to load the logo" />
            </div>
          </div>
          <div className="rightBod w-1/2 flex items-center justify-center">
            <LoginCard setLoggedIn={setLoggedIn} />
          </div>
        </div>
      )}

      {loggedIn && <TimeLine />}
    </div>
  );
}
