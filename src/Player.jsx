import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";

import {
  IconButton,
  Slider,
  Box,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";
import { usePlayerControls } from "./components/usePlayerControls";
import { useStaticDataStore } from "./store/player-store";

const Player = () => {
  const {
    playing,
    muted,
    volume,
    fullScreen,
    progress,
    duration,
    playerRef,
    playbackRate,
    minimized,
    minimizedWidth,
    minimizedHeight,
    controlsVisible,
    setControlsVisible,
    handleTogglePlayPause,
    handleVolumeChange,
    handleSpeedChange,
    handleToggleMute,
    handleToggleFullScreen,
    handleProgressChange,
    handleSeek,
    handleMouseEnter,
    handleProgress,
    handleMouseLeave,
    handleVideoClick,
    toggleMinimized,
    closeMinimized,
  } = usePlayerControls();

  const { staticData } = useStaticDataStore((state) => state);
  const { getPreviousVideoUrl, getNextVideoUrl } = staticData;

  if (!staticData) {
    return <div>Loading...</div>;
  }

  const { videos } = staticData;

  const [currentVideoId, setCurrentVideoId] = useState(videos[0]?.id);
  const currentProduct = videos.find(
    (product) => product.id === currentVideoId
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "n") {
        setCurrentVideoId((prevId) => getNextVideoUrl(prevId));
      } else if (event.key === "p") {
        setCurrentVideoId((prevId) => getPreviousVideoUrl(prevId));
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [getNextVideoUrl, getPreviousVideoUrl]);

  return (
    <Box
      elevation={3}
      sx={{ position: "relative", width: "100%", overflow: "hidden" }}
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => setControlsVisible(false)}
    >
      <Box
        className={`player ${fullScreen ? "fullscreen" : ""}`}
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        {minimized ? (
          <Paper
            elevation={3}
            sx={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              width: minimizedWidth,
              height: minimizedHeight,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 1,
            }}
          >
            <ReactPlayer
              ref={playerRef}
              url={currentProduct?.videoUrl}
              playing={playing} 
              volume={muted ? 0 : volume}
              muted={muted}
              playbackRate={playbackRate}
              onProgress={handleProgress}
              onClick={handleVideoClick}
              width="100%"
              height="100%"
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={closeMinimized}>
                <FullscreenExitIcon />
              </IconButton>
              <IconButton onClick={closeMinimized}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Paper>
        ) : (
          <>
            <ReactPlayer
              ref={playerRef}
              url={currentProduct?.videoUrl}
              playing={playing}
              volume={muted ? 0 : volume}
              muted={muted}
              playbackRate={playbackRate}
              onProgress={handleProgress}
              onClick={handleVideoClick}
              width="100%"
              height="100%"
            />
            {controlsVisible || !playing ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  pl: "30px",
                  pr: "20px",
                }}
              >
                <Box
                  className="controls"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Tooltip title={muted ? "Unmute" : "Mute"}>
                    <IconButton onClick={handleToggleMute} color="primary">
                      {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </IconButton>
                  </Tooltip>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={handleVolumeChange}
                    sx={{ width: 200 }}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="Rewind 10 seconds">
                    <IconButton
                      onClick={() => handleSeek(-10)}
                      color="primary"
                    >
                      <FastRewindIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={playing ? "Pause" : "Play"}>
                    <IconButton
                      onClick={handleTogglePlayPause}
                      color="primary"
                    >
                      {playing ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Forward 10 seconds">
                    <IconButton
                      onClick={() => handleSeek(10)}
                      color="primary"
                    >
                      <FastForwardIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{ marginLeft: 2, marginRight: 1 }}
                  >
                    Speed:
                  </Typography>
                  <Slider
                    min={0.5}
                    max={4}
                    step={0.25}
                    value={playbackRate}
                    onChange={handleSpeedChange}
                    sx={{ width: 100 }}
                  />
                  <Typography variant="body2" sx={{ marginLeft: 2 }}>
                    {playbackRate.toFixed(2)}x
                  </Typography>
                  <Tooltip
                    title={fullScreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    <IconButton
                      onClick={handleToggleFullScreen}
                      color="primary"
                    >
                      {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Minimize">
                    <IconButton
                      sx={{ mb: 1.5 }}
                      onClick={toggleMinimized}
                      color="primary"
                    >
                      <MinimizeIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ) : null}
            <Box
              className="progress-overlay"
              sx={{
                position: "absolute",
                bottom: "3vw",
                left: 0,
                width: "100%",
                paddingLeft: "50px",
                mb: playing ? 0 : 3,
                zIndex: 1,
              }}
            >
              <Typography variant="body2" sx={{ color: "#fff" }}>
                {formatTime(progress.playedSeconds)} / {formatTime(duration)}
              </Typography>
              <Slider
                min={0}
                max={duration}
                value={progress.playedSeconds}
                onChange={handleProgressChange}
                sx={{ width: "92%", color: "#fff" }}
              />
            </Box>
          </>
        )}
      </Box>
      {!playing && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "right",
            mt: 2,
            mb: 2,
            paddingRight: "20px",
            paddingLeft: "30px",
          }}
        >
          <IconButton
            onClick={() =>
              setCurrentVideoId((prevId) => {
                const previousProductId = getPreviousVideoUrl(prevId); // Use getPreviousVideoUrl directly
                return previousProductId;
              })
            }
            color="primary"
            disabled={currentVideoId === staticData.videos[0].id}
          >
            Previous
          </IconButton>
          <IconButton
            onClick={() =>
              setCurrentVideoId((prevId) => {
                const nextProductId = getNextVideoUrl(prevId);
                console.log("Next Product ID:", nextProductId);
                return nextProductId;
              })
            }
            color="primary"
            disabled={
              currentVideoId ===
              staticData.videos[staticData?.videos.length - 1].id
            }
          >
            Next
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export default Player;
