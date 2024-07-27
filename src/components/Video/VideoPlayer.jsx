import { useRef, useEffect } from 'react';

function VideoPlayer({ src, controls = true, ...props }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      let playback = 0;

      video.onended = () => {
        playback = playback + 1;
        if (playback != 3) {
          video.play();
        }
      };
    }
  }, []);

  return (
    <video
      ref={videoRef}
      playsInline
      muted
      controls={controls}
      src={src}
      {...props}
    />
  );
}

export default VideoPlayer;
