"use client";
import { useEffect, useState } from "react";
import CheckPointBox from "./CheckPointBox";
import Markdown from "react-markdown";
import axios from "axios";

const MainLoader = () => {
  return (
    /* From Uiverse.io by JkHuger */

    <main id="container">
      <div class="dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      <div class="dots2">
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
      </div>
      <div class="circle"></div>
    </main>
  );
};

export default function TimeLine() {
  const user = localStorage.getItem("user");
  const realName = localStorage.getItem("realName");
  const [checkPoints, setCheckPoints] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    async function fetchMileStones() {
      console.log(checkPoints.length);
      if (checkPoints.length === 0) setLoader(true);
      try {
        await axios
          .get("/api/v1/getMilestones", {
            params: {
              task: 0,
              user: localStorage.getItem("user"),
            },
          })
          .then((res) => {
            console.log(res.data.data);
            setCheckPoints(res.data.data);
            setLoader(false);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    }
    fetchMileStones();
  }, [trigger]);

  return (
    <div className="background">
      <div className="text-4xl text-center font-bold my-7 ">
        Welcome {realName}
      </div>
      <div className="text-xl text-center font-bold my-7 text-gray-300">
        Complete all the checkpoints for the certificate
      </div>
      <div className="flex flex-col justify-center gap-3 items-center my-10">
        {loader && (
          <div className="mt-12 ">
            <MainLoader />
            <div className="text-2xl animate-pulse text-center my-4 font-bold ">
              Creating your CheckPoints
            </div>
          </div>
        )}
        {checkPoints &&
          Object.keys(checkPoints).map((key, index) => {
            return (
              <CheckPointBox
                key={index}
                id={checkPoints[key].identifier}
                title={checkPoints[key].title}
                content={checkPoints[key].content}
                state={checkPoints[key].status}
                url={checkPoints[key].url}
                trigger={trigger}
                setTrigger={setTrigger}
              />
            );
          })}
      </div>
    </div>
  );
}
