import { useRef, useEffect, useState } from 'react';
import { Button, Card, Radio, Slider } from 'antd';
import { CaretRightFilled, PauseOutlined } from '@ant-design/icons';

import './VideoPlayer.css';

function VideoPlayer({ src, controls = true, customControls, ...props }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  controls = customControls ? !customControls : controls;

  const speed = [
    {
      label: '0.5x',
      value: '0.5',
    },
    {
      label: '1x',
      value: '1',
    },
    {
      label: '2x',
      value: '2',
    },
  ];

  const handleSpeedChange = (e) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = e.target.value;
    }
  };

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

      video.addEventListener('play', () => {
        setIsPlaying(true);
      });

      video.addEventListener('pause', () => {
        setIsPlaying(false);
      });

      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
      });

      video.addEventListener('timeupdate', (e) => {
        const videoProgress = (video.currentTime / video.duration) * 100;
        setProgress(videoProgress);
      });

      video.setAttribute('oncontextmenu', 'return false;');
    }
  }, []);

  return (
    <div className="video-container">
      {isLoading && <Card loading />}

      <video
        ref={videoRef}
        playsInline
        muted
        controls={controls}
        src={src}
        {...props}
      />

      {!isLoading && customControls && (
        <>
          <Slider value={progress} />
          <div className="video-custom-controls">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<CaretRightFilled />}
              onClick={() => {
                videoRef.current?.play();
              }}
              disabled={isPlaying}
            />
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<PauseOutlined />}
              onClick={() => {
                videoRef.current?.pause();
              }}
              disabled={!isPlaying}
            />

            <Radio.Group
              size="large"
              block
              options={speed}
              defaultValue="1"
              optionType="button"
              buttonStyle="solid"
              onChange={handleSpeedChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default VideoPlayer;
