import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
} from "@heroicons/react/24/outline";
// import spotifyApi from "../lib/spotify";
import useSpotify from "../hooks/useSpotify";
import { playlistIdState } from "../atoms/playlistAtom";
import { useRecoilState } from "recoil";

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  // console.log(session);
  const [playlist, setPlaylist] = useState([]);
  // const [playlistid, setPlaylistId] = useState(null);
  // console.log(playlistid);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylist(data.body.items);
      });
    }
  }, [session, spotifyApi]);
  // console.log(playlist);
  return (
    <div className="text-gray-500 p-5 text-xs border-r border-gray-900 overflow-y-scroll overflow-x-hidden scrollbar-hide h-screen lg:text-[18px] sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex ">
      <div className="space-y-4">
        <img
          className="w-full h-[50px] max-w-[131px] "
          src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
          alt=""
        />
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => signOut()}
        >
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <MagnifyingGlassIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <BuildingLibraryIcon className="h-5 w-5" />
          <p>Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5" />

          <p>Liked songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        {/* Playlists from API */}

        {playlist?.map((list) => {
          return (
            <p
              key={list.id}
              onClick={() => setPlaylistId(list.id)}
              className="cursor-pointer hover:text-white truncate"
            >
              {list.name}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
