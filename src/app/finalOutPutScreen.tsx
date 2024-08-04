import { useEffect, useState } from "react";
import useSound from "use-sound";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { IconContext } from "react-icons";

// Add this declaration at the top of your file
declare global {
  interface Window {
    highlightTimeout?: NodeJS.Timeout;
  }
}

const PlayerComponent = () => {
  const audioFile = '/testAudio.mp3'
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { pause, duration, sound }] = useSound(audioFile);
  const [currTime, setCurrTime] = useState({
    min: "0",
    sec: "0",
  });
  const [seconds, setSeconds] = useState(0);

  const playingButton = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek([]));
        const min = Math.floor(sound.seek([]) / 60);
        const sec = Math.floor(sound.seek([]) % 60);
        setCurrTime({
          min: String(min).padStart(2, "0"),
          sec: String(sec).padStart(2, "0"),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  //a function to handle the highlight card click - it will go to the time where the joke starts and runs for 40 secs
  const handleCardClick = (highlight: { startSec: number; durationSec?: number; text?: string; laughScore?: number; }) => {
    if (sound) {
      // Stop the currently playing audio
      pause();
      
      // Clear any existing timeout
      if (window.highlightTimeout) {
        clearTimeout(window.highlightTimeout);
      }
  
      // Seek to the start of the new highlight
      sound.seek(highlight.startSec);
      setSeconds(highlight.startSec);
      
      // Update the current time display
      const min = Math.floor(highlight.startSec / 60);
      const sec = Math.floor(highlight.startSec % 60);
      setCurrTime({
        min: String(min).padStart(2, "0"),
        sec: String(sec).padStart(2, "0"),
      });
  
      // Start playing the new highlight
      play();
      setIsPlaying(true);
  
      // Set a timeout to stop playing after the highlight duration
      if (highlight.durationSec) {
        window.highlightTimeout = setTimeout(() => {
          pause();
          setIsPlaying(false);
        }, highlight.durationSec * 1000);
      }
    }
  };

  //mock data
  const mockData = {
    "data": {
      "highlights": [
        {
          "startSec": 7,
          "durationSec": 28,
          "text": "Braun",
          "laughScore": 14956.07
        },
        {
          "startSec": 100,
          "durationSec": 34,
          "text": "fuchsia",
          "laughScore": 72806.93
        },
        {
          "startSec": 49,
          "durationSec": 87,
          "text": "Hatchback",
          "laughScore": 97048.86
        },
        {
          "startSec": 59,
          "durationSec": 82,
          "text": "East",
          "laughScore": 99229.1
        },
        {
          "startSec": 73,
          "durationSec": 18,
          "text": "AGP",
          "laughScore": 31583.65
        }
      ]
    }
  };

  //test count - the number of highlights in a video will be equal to the number of cards being displayed
  const highlights = mockData.data.highlights; //having 7 for testing purposes;

  return (
    <>
    <div className="mt-[100px]">
      <div className="flex items-center space-x-4">
        <button
          onClick={playingButton}
          className="bg-transparent border-none p-0 focus:outline-none"
        >
          <IconContext.Provider value={{ size: "2em", color: "#FFA500" }}>
            {!isPlaying ? <AiFillPlayCircle /> : <AiFillPauseCircle />}
          </IconContext.Provider>
        </button>
        <input
          type="range"
          min="0"
          // max={duration / 1000}
          value={seconds}
          onChange={(e) => {
            sound.seek([e.target.value]);
          }}
          className="w-[800px] accent-yellow-500"
        />
      </div>
      <div className="mt-2">
        <p className="text-white text-sm">
          {currTime.min}:{currTime.sec}
        </p>
      </div>
    </div>

    <div className = "grid gap-y-[60px] gap-x-[300px] mx-[170px] grid-cols-3 p-14">
      
    {highlights.map((highlight, index) => (   
      <div key={index}>
      <button onClick={() => handleCardClick(highlight)} className=" ring-1 bg-[#A9DAAE] hover:bg-green-400 w-80 h-72 ring-black ring-opacity-5 font-normal rounded-3xl shadow-md mr-40" type='button'>
        <div className="text-black text-[32px] text-left p-9">
        {highlight.text}
        </div>
        </button>
        </div>
    ))}

    </div>
    
    
    </>
  );
};

export default PlayerComponent;