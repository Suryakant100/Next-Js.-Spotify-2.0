import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { shuffle } from "lodash";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import Songs from "../Components/Songs";

let totalTime = 0;

const colores = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];
function Center() {
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const spotifyApi = useSpotify();
  // console.log(session);
  console.log(playlist);

  // {
  //   playlist?.tracks.items?.forEach((val) => {
  //     const count = val?.track?.duration_ms;
  //     totalTime =totalTime+ count;
  //   });
  // }

  function SumTotal() {
    playlist?.tracks.items?.forEach((val) => {
      var count = val?.track?.duration_ms;
      totalTime = totalTime + count;
    });
    return Number(totalTime);
  }

  console.log(totalTime);

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function convertMsToTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    // 👇️ If you don't want to roll hours over, e.g. 24 to 00
    // 👇️ comment (or remove) the line below
    // commenting next line gets you `24:00:00` instead of `00:00:00`
    // or `36:15:31` instead of `12:15:31`, etc.
    hours = hours % 24;

    return `${padTo2Digits(hours)}hr ${padTo2Digits(minutes)}min ${padTo2Digits(
      seconds
    )}sec`;
  }

  useEffect(() => {
    setColor(shuffle(colores).pop());
    SumTotal();
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("Somthing went wrong!", err));
  }, [spotifyApi, playlistId]);

  return (
    <div className="flex-grow relative overflow-y-scroll scrollbar-hide h-screen">
      <nav className="absolute top-8 left-4 flex space-x-3">
        <ChevronLeftIcon className=" cursor-pointer w-9 h-9 text-white p-2 bg-black bg-opacity-50 rounded-full" />
        <ChevronRightIcon className="cursor-pointer w-9 h-9 text-white p-2 bg-black bg-opacity-50  rounded-full" />
      </nav>
      <header className="absolute top-5 right-8 text-white">
        <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt=""
          />
          <h2>{session?.user.name}</h2>
          {/* <ChevronDownIcon className="h-5 w-5" /> */}
          <Tooltip title="Logout">
            <IconButton>
              <LogoutIcon
                onClick={() => signOut()}
                className="text-white w-5 h-5"
              />
            </IconButton>
          </Tooltip>
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-9`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div className="flex flex-col justify-end">
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-[3rem] lg:text-[4.5rem] font-bold mt-2">
            {playlist?.name}
          </h1>
          <p className="text-[#b3b3b3] text-[1rem] font-medium mt-6">
            {playlist?.description}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-[0.875rem] before:text-[0.875rem] text-white">
              Spotify
            </span>
            {/* <span className="text-4xl">.</span> */}
            <span className=" ">{playlist?.followers.total} like</span>
            {/* <span className="text-4xl">.</span> */}
            <span className="">{playlist?.tracks.items.length} songs,</span>
            {/* <span className="text-4xl">,</span> */}
            <span className="text-[#b3b3b3]">
              {null ? "" : convertMsToTime(totalTime)}
            </span>
          </div>
        </div>
      </section>
      <div className="">
        <Songs />
      </div>
    </div>
  );
}

export default Center;
