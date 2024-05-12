import create from "zustand";

export const useStaticDataStore = create((set) => {
  const initialState = {
    videos: [
      {
        id: 1,
        name: "Video 1",
        description: "Description for Video 1",
        videoUrl: "./video1.mp4",
      },
      {
        id: 2,
        name: "Video 2",
        description: "Description for Video 2",
        videoUrl: "./video3.mp4",
      },
      {
        id: 3,
        name: "Video 3",
        description: "Description for Video 3",
        videoUrl: "./video4.mp4",
      },
      {
        id: 4,
        name: "Video 4",
        description: "Description for Video 4",
        videoUrl: "./video2.mp4",
      },
      {
        id: 5,
        name: "Video 5",
        description: "Description for Video 5",
        videoUrl: "./video5.mp4",
      },
    ],

    // Function to get the URL of the previous video
    getPreviousVideoUrl: (currentVideoId) => {
      const currentIndex = initialState.videos.findIndex(
        (video) => video.id === currentVideoId
      );
      const previousIndex =
        (currentIndex - 1 + initialState.videos.length) %
        initialState.videos.length;
      return initialState.videos[previousIndex].id;
    },

    // Function to get the ID of the next video
    getNextVideoUrl: (currentVideoId) => {
      const currentIndex = initialState.videos.findIndex(
        (video) => video.id === currentVideoId
      );
      const nextIndex = (currentIndex + 1) % initialState.videos.length;
      return initialState.videos[nextIndex].id;
    },
  };

  set({ staticData: initialState });
  return { staticData: initialState };
});
