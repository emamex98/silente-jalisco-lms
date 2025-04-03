import { Button } from 'antd';
import VideoPlayer from '@components/Video/VideoPlayer';

function LearnScreen({
  currentWord,
  currentStep,
  vocabularyKeys,
  onPrev,
  onNext,
}) {
  return (
    <div className="practice-lesson-vocabulary-container">
      <div key={currentWord.meaning}>
        <h1 className="practice-lesson-vocabulary-meaning">
          {currentWord.meaning}
        </h1>

        <VideoPlayer
          src={currentWord.src}
          customControls
          autoPlay
          width="100%"
        />
      </div>
      <div className="practice-lesson-vocabulary-navigation">
        <Button
          size="large"
          onClick={onPrev}
          style={{
            display: currentStep > 1 ? '' : 'none',
          }}
        >
          Anterior
        </Button>
        <Button
          size="large"
          onClick={onNext}
          style={{
            display: currentStep <= vocabularyKeys?.length ? '' : 'none',
          }}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

export default LearnScreen;
