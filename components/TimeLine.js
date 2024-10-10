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
  const [showCongrats, setShowCongrats] = useState(false);
  const showLeaderBoard = () => {
    console.log("leaderboard");
  };
  useEffect(() => {
    async function fetchMileStones() {
      const statusArray = checkPoints.map((checkPoint) => {
        checkPoint.status;
      });
      if (statusArray.every((status) => status === "Completed")) {
        setShowCongrats(true);
      }
      console.log(checkPoints.length);

      //checking if the checkPoints are already fetched and setting loader

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
        <div className="w-full h-40 flex flex-col justify-center items-center my-4">
          {showCongrats && (
            <div className="text-2xl  my-4 mx-5  text-center font-bold">
              Congratulations! You have completed all the checkpoints
            </div>
          )}
          {!loader && (
            <button
              onClick={showLeaderBoard}
              className="bg-transparent hover:bg-neutral-200 font-semibold hover:text-black border-[1.5px] border-neutral-200 text-white  my-4 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              LeaderBoard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
