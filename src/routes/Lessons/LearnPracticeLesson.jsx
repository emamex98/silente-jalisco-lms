import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Divider, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLessonData } from '@hooks/useLessonData';
import IntroScreen from './IntroScreen';
import PracticeScreen from './PracticeScreen';
import LearnScreen from './LearnScreen';
import CompletionModal from '@components/Modal/CompletionModal';
import { MODE_MAPPER, MODES } from '@utils/constants';

function LearnPracticeLesson() {
  const { level, name, modep } = useParams();
  const navigate = useNavigate();
  const mode = MODE_MAPPER[modep];
  const [currentStep, setCurrentStep] = useState(0);
  const [testResults, setTestResults] = useState([]);

  const {
    vocabularyKeys,
    currentWord,
    lessonDetails,
    error,
    fetchLessonDetails,
  } = useLessonData(currentStep);

  const handleOnNext = () => {
    setCurrentStep((current) => current + 1);
  };

  const handleOnPrev = () => {
    setCurrentStep((current) => current - 1);
  };

  const addTestResult = (word, assert) => {
    setTestResults((current) => [...current, { word, assert }]);
  };

  const resetTest = () => {
    setCurrentStep(1);
    setTestResults([]);
  };

  const calculateResults = () => {
    const incorrectAnswers = testResults.filter((item) => !item.assert);
    const assertCount = testResults.length - incorrectAnswers.length;
    const score = Math.floor((assertCount / vocabularyKeys?.length) * 100);

    return {
      incorrectAnswers,
      assertCount,
      score,
      totalCount: vocabularyKeys?.length,
    };
  };

  useEffect(() => {
    const lessonPath = `${level}/${name}`;
    fetchLessonDetails(lessonPath, mode);
  }, [level, name, fetchLessonDetails]);

  const isCompleted = currentStep === vocabularyKeys?.length + 1;

  return (
    <section className="practice-lesson-container">
      <div>
        <Link onClick={() => navigate(-1)}>
          <ArrowLeftOutlined />
          {` Regresar`}
        </Link>
        <Divider />
      </div>

      {error && (
        <Alert
          message={error.title}
          description={error.description}
          type="error"
          showIcon
        />
      )}

      {currentStep === 0 && (
        <IntroScreen
          lessonDetails={lessonDetails}
          onStart={handleOnNext}
          mode={mode}
        />
      )}

      {currentStep >= 1 && currentWord && mode === MODES.LEARN && (
        <LearnScreen
          currentWord={currentWord}
          currentStep={currentStep}
          vocabularyKeys={vocabularyKeys}
          onPrev={handleOnPrev}
          onNext={handleOnNext}
        />
      )}

      {currentStep >= 1 && currentWord && mode === MODES.PRACTICE && (
        <PracticeScreen
          currentWord={currentWord}
          onAnswered={(isCorrect) => {
            addTestResult(currentWord.meaning, isCorrect);
            handleOnNext();
          }}
        />
      )}

      {isCompleted && (
        <CompletionModal
          isOpen={isCompleted}
          mode={mode}
          results={calculateResults()}
          onRestart={resetTest}
          onFinish={() => navigate('/dashboard')}
        />
      )}
    </section>
  );
}

export default LearnPracticeLesson;
