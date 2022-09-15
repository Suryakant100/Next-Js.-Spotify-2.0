import React, { useState, useEffect, useCallback } from "react";
import useSpotify from "../hooks/useSpotify";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import { useRecoilState } from "recoil";
import useSongInfo from "../hooks/useSonginfo";
import { useSession } from "next-auth/react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PhonelinkIcon from "@mui/icons-material/Phonelink";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import RepeatOneIcon from "@mui/icons-material/RepeatOne";
import LyricsIcon from "@mui/icons-material/Lyrics";
import TocIcon from "@mui/icons-material/Toc";
import DevicesIcon from "@mui/icons-material/Devices";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { debounce } from "lodash";

function Player() {
  const theme = useTheme();
  const spotifyApi = useSpotify();
  // console.log(spotifyApi);
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackid] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setisplaying] = useRecoilState(isPlayingState);
  const [volume, setvolume] = useState(50);
  const [position, setPosition] = useState(0);
  const [value, setValue] = React.useState(30);

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  const songInfo = useSongInfo();
  console.log(songInfo);
  // const duration = {songInfo.duration_ms};
  function valuetext(value) {
    return `${value}°C`;
  }
  const TinyText = styled(Typography)({
    fontSize: "0.75rem",
    opacity: 0.38,
    fontWeight: 500,
    letterSpacing: 0.2,
  });

  function formatDuration(time) {
    const min = Math.floor((time / 1000 / 60) << 0);
    const sec = Math.floor((time / 1000) % 60);
    return sec == 60
      ? min + 1 + ":00"
      : min + ":" + (sec < 10 ? "0" : "") + sec;
  }

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now playing", data.body);
        setCurrentTrackid(data.body?.item?.id);
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setisplaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setisplaying(false);
      } else {
        spotifyApi.play();
        setisplaying(true);
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setvolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 500),
    []
  );

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white border-t-[1px] border-gray-900 flex justify-between text-xs md:text-base px-2 md:px-8 overflow-y-scroll scrollbar-hide">
      <div className="flex space-x-4 items-center max-w-[180px]">
        <img
          className=" md:inline w-10 h-10"
          src={songInfo?.album?.images?.[0].url}
          alt=""
        />

        <div className="flex space-y-0 flex-col">
          <p className="text-[0.875rem] cursor-pointer hover:underline truncate">
            {songInfo?.name}
          </p>
          <p className="text-[#b3b3b3] text-[ 0.6875rem] cursor-pointer hover:underline">
            {songInfo?.artists[0]?.name}
          </p>
        </div>
        <FavoriteBorderIcon className=" opacity-70 hover:opacity-90 hidden md:inline" />
        <PhonelinkIcon className=" opacity-70 hover:opacity-90 hidden md:inline" />
      </div>
      {/* Center */}
      <div className="w-2/5 max-w-[722px] flex flex-col ">
        <div className="flex space-x-4 items-center mt-2 mx-auto">
          <ShuffleIcon className="button" />
          <SkipPreviousIcon
            onClick={() => spotifyApi.skipToPrevious()}
            className="button"
          />
          {isPlaying ? (
            <PauseCircleFilledIcon
              onClick={handlePlayPause}
              className="text-[#b3b3b3] hover:text-white cursor-pointer hover:scale-110 transition transform duration-100 ease-out text-[42px]"
              fontSize="large"
            />
          ) : (
            <PlayCircleFilledIcon
              onClick={handlePlayPause}
              className="text-[#b3b3b3] hover:text-white cursor-pointer hover:scale-110 transition transform duration-100 ease-out text-[42px]"
              fontSize="large"
            />
          )}

          <SkipNextIcon
            onClick={() => spotifyApi.skipToNext()}
            className="button"
          />
          <RepeatOneIcon className="button" />
        </div>
        <div className="flex space-x-2">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 0,
            }}
          >
            <TinyText>{formatDuration(position)}</TinyText>
            {/* <TinyText>{formatDuration(duration)}</TinyText> */}
          </Box>
          <Slider
            aria-label="time-indicator"
            size="small"
            value={position}
            min={0}
            step={1}
            max={songInfo?.duration_ms}
            onChange={(_, value) => setPosition(songInfo?.duration_ms / 1000)}
            sx={{
              color:
                theme.palette.mode === "dark" ? "#1db954" : "rgba(0,0,0,0.)",
              height: 4,
              "& .MuiSlider-thumb": {
                width: 8,
                height: 8,
                transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                "&:before": {
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                },
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: `0px 0px 0px 8px ${
                    theme.palette.mode === "dark"
                      ? "rgb(255 255 255 / 16%)"
                      : "rgb(0 0 0 / 16%)"
                  }`,
                },
                "&.Mui-active": {
                  width: 20,
                  height: 20,
                },
              },
              "& .MuiSlider-rail": {
                opacity: 0.28,
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 0,
            }}
          >
            {/* <TinyText>{formatDuration(position)}</TinyText> */}
            <TinyText>{formatDuration(songInfo?.duration_ms)}</TinyText>
          </Box>
        </div>
      </div>
      <div className="flex items-center space-x-3 max-w-[257px] w-[30%]">
        {/* < MicrophoneIcon className="button"/> */}
        {/* <LyricsIcon /> */}
        <TocIcon className="opacity-70 hover:opacity-90 hidden md:inline" />
        <DevicesIcon className="opacity-70 hover:opacity-90 hidden md:inline" />
        <div className="flex items-center space-x-2">
          <VolumeDownIcon
            onClick={() => volume > 0 && setvolume(volume - 10)}
            className="opacity-70 hover:opacity-90"
          />
          <Box sx={{ width: 130 }}>
            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 0 }}
              alignItems="center"
            >
              {/* <VolumeDown /> */}
              <Slider
                size="small"
                aria-label="Volume"
                value={volume}
                onChange={(e) => setvolume(Number(e.target.value))}
              />
              {/* <VolumeUp /> */}
            </Stack>
          </Box>
          <VolumeUpIcon
            onClick={() => volume < 100 && setvolume(volume + 10)}
            className="opacity-70 hover:opacity-90"
          />
        </div>
      </div>
    </div>
  );
}

export default Player;
