import { useRef, useState, useEffect } from "react";

// Your helper functions getNextVideoUrl and getPreviousVideoUrl
// assuming you have defined them somewhere in your code

export const usePlayerControls = () => {
  const [controlsVisible, setControlsVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(0.5);
  const [fullScreen, setFullScreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [minimized, setMinimized] = useState(false);
  const [minimizedWidth, setMinimizedWidth] = useState(300);
  const [minimizedHeight, setMinimizedHeight] = useState(300 * (9 / 16));
  const [progress, setProgress] = useState({
    playedSeconds: 0,
    loadedSeconds: 0,
  });
  const [duration, setDuration] = useState(0);
  const [lastPlayedSeconds, setLastPlayedSeconds] = useState(0);
  const playerRef = useRef(null);
  const controlsTimeout = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getDuration()) {
        setDuration(playerRef.current.getDuration());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (event) => {
    switch (event.key) {
      case " ":
        event.preventDefault();
        handleTogglePlayPause();
        break;
      case "ArrowUp":
        event.preventDefault();
        setVolume(Math.min(volume + 0.25, 1));
        break;
      case "ArrowDown":
        event.preventDefault();
        setVolume(Math.max(volume - 0.25, 0));
        break;
      case "m":
      case "M":
        event.preventDefault();
        handleToggleMute();
        break;
      case "f":
      case "F":
        event.preventDefault();
        handleToggleFullScreen();
        break;
      case "Escape":
        event.preventDefault();
        if (fullScreen) {
          handleToggleFullScreen();
        }
        break;
      case "w":
      case "W":
        event.preventDefault();
        toggleMinimized();
        break;
      case "n":
      case "N":
        event.preventDefault();
        setCurrentVideoId((prevId) => {
          const nextProductId = getNextVideoUrl(prevId);
          console.log("Next Product ID:", nextProductId);
          return nextProductId;
        });
        break;
      case "p":
      case "P":
        event.preventDefault();
        setCurrentVideoId((prevId) => {
          const previousProductId = getPreviousVideoUrl(prevId);
          return previousProductId;
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleToggleMute = () => {
    // Toggle mute state
    setMuted((prevMuted) => !prevMuted);

    if (!muted) {
      setVolume(volumeBeforeMute);
    } else {
      setVolumeBeforeMute(volume);

      if (volume !== 0) {
        setVolume(0);
      }
    }
  };

  const handleVolumeChange = (event, increment) => {
    const newVolume = Math.min(Math.max(volume + increment, 0), 1);
    setVolume(newVolume);
    if (newVolume > 0) {
      setMuted(false);
    }

    setVolumeBeforeMute(newVolume);
  };

  const handleToggleFullScreen = () => {
    if (!fullScreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setFullScreen(!fullScreen);
  };

  const handleProgress = (state) => {
    setProgress({
      playedSeconds: state.playedSeconds,
      loadedSeconds: state.loadedSeconds,
    });
  };

  const handleSeek = (seconds) => {
    const newProgress = {
      ...progress,
      playedSeconds: progress.playedSeconds + seconds,
    };
    setProgress(newProgress);
    playerRef.current.seekTo(progress.playedSeconds + seconds, "seconds");
  };

  const handleSpeedChange = (event, newValue) => {
    setPlaybackRate(newValue);
  };

  const handleMouseEnter = () => {
    clearTimeout(controlsTimeout.current);
  };

  const handleMouseLeave = () => {
    controlsTimeout.current = setTimeout(() => {
      setFullScreen(false);
    }, 3000);
  };

  const handleProgressChange = (event, newValue) => {
    const newProgress = { ...progress, playedSeconds: newValue };
    setProgress(newProgress);
    playerRef.current.seekTo(newValue);
  };

  const handleVideoClick = () => {
    handleTogglePlayPause();
  };

  // Function to toggle minimized state
  const toggleMinimized = () => {
    setMinimized((prevMinimized) => {
      if (!prevMinimized) {
        setLastPlayedSeconds(progress.playedSeconds);
        setPlaying(true);
      } else {
        setPlaying(false);
        if (lastPlayedSeconds > 0) {
          playerRef.current.seekTo(lastPlayedSeconds);
        }
      }
      return !prevMinimized;
    });
  };
  

  // Restore last played position when maximizing or expanding
  useEffect(() => {
    if (!minimized && lastPlayedSeconds > 0) {
      playerRef.current.seekTo(lastPlayedSeconds);
      if (!playing) {
        setPlaying(false);
      }
    }
  }, [minimized, lastPlayedSeconds, playing]);

  // Function to close the minimized player
  const closeMinimized = () => {
    setMinimized(false);
  };

  const handleTogglePlayPause = () => {
    // Toggle playing state only if the player is not minimized
    if (!minimized) {
      setPlaying((prevPlaying) => !prevPlaying);
    }
  };

  // Restore last played position when maximizing
  useEffect(() => {
    if (!minimized && lastPlayedSeconds > 0) {
      playerRef.current.seekTo(lastPlayedSeconds);
    }
  }, [minimized, lastPlayedSeconds]);

  return {
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
    handleTogglePlayPause,
    handleVolumeChange,
    handleSpeedChange,
    handleToggleMute,
    handleToggleFullScreen,
    handleProgressChange,
    handleSeek,
    handleMouseEnter,
    handleVideoClick,
    handleProgress,
    handleMouseLeave,
    toggleMinimized,
    closeMinimized,
    setControlsVisible,
  };
};
