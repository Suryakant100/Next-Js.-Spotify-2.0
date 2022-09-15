import React from "react";
import useSpotify from "../hooks/useSpotify";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import { useRecoilState } from "recoil";

function convertor(time) {
  const min = Math.floor((time / 1000 / 60) << 0);
  const sec = Math.floor((time / 1000) % 60);
  return sec == 60 ? min + 1 + ":00" : min + ":" + (sec < 10 ? "0" : "") + sec;
}

function Song({ track, order }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackid] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setisplaying] = useRecoilState(isPlayingState);
  // console.log(track);


  const playSong = () => {
    setCurrentTrackid(track.track?.id);
    setisplaying(true);
    spotifyApi.play({
      uris: [track?.track?.uri],
    });
  };
  

  return (
    <div
      onClick={playSong}
      className="grid grid-cols-2 text-gray-400 hover:text-white py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer"
    >
      <div className="flex items-center space-x-4 hover:text-white">
        <p>{order + 1}</p>
        <img
          className="w-10 h-10"
          src={track.track?.album?.images[0]?.url}
          alt=""
        />
        <div>
          <p className="text-white w-36 lg:w-64 truncate text-[1rem] font-medium hover:underline">
            {track?.track?.name}
          </p>
          <p className="w-40 text-[ 0.875rem] hover:underline">
            {track.track?.artists[0].name}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0 truncate">
        <p className="hidden md:inline truncate max-w-[343px]">
          {track.track?.album.name}
        </p>
        <p>{convertor(track.track?.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
