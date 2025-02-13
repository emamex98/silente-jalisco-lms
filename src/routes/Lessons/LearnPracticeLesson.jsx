import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { get } from '@libs/firebase/database';
import { getFileUrl } from '@libs/firebase/storage';
import { Divider, Alert, Button, Modal, Result } from 'antd';
import VideoPlayer from '@components/Video/VideoPlayer';
import { ArrowLeftOutlined } from '@ant-design/icons';

const errors = {
  NO_RESULTS_RETURNED: {
    title: 'Ocurrió un error al intentar cargar la lección que buscas.',
  },
};

function LearnPracticeLesson() {
  const { level, name } = useParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  const [vocabulary, setVocabulary] = useState(null);
  const [vocabularyKeys, setVocabularyKeys] = useState(null);
  const [currentWord, setCurrentWord] = useState(null);
  const [lessonDetails, setLessonDetails] = useState({
    name: '',
    level: '',
  });

  const handleOnNext = () => {
    setCurrentStep((current) => current + 1);
  };

  const handleOnPrev = () => {
    setCurrentStep((current) => current - 1);
  };

  const fetchLessonDetails = async (path) => {
    try {
      const response = await get(`lessons/${path}`);

      if (!response) {
        setError(errors.NO_RESULTS_RETURNED);
      }

      if (response) {
        const { styledName, styledLevel, content } = response;
        setLessonDetails({ name: styledName, level: styledLevel });

        const mappedVideos = {};

        for (const key of Object.keys(content)) {
          const { id, meaning, path } = content[key];
          const src = await getFileUrl(path);
          mappedVideos[id] = { id, src, path, meaning };
        }

        setVocabulary(mappedVideos);
        setVocabularyKeys(Object.keys(content));
      }
    } catch (e) {
      console.error(e);
      setError({
        ...errors.STORAGE_ERROR,
        description: e.toString(),
      });
    }
  };

  useEffect(() => {
    setError(null);
    const lessonPath = `${level}/${name}`;
    fetchLessonDetails(lessonPath);
  }, [level, name]);

  useEffect(() => {
    if (vocabulary && vocabularyKeys && currentStep > 0) {
      const index = currentStep - 1;
      setCurrentWord(vocabulary[vocabularyKeys[index]]);
    }
  }, [currentStep, vocabulary, vocabularyKeys]);

  return (
    <section className="practice-lesson-container">
      <div>
        <Link
          onClick={() => {
            navigate(-1);
          }}
        >
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
        <>
          <h1 className="practice-lesson-title">
            {lessonDetails.level} - {lessonDetails.name}
          </h1>
          <p className="practice-lesson-description">
            Esta sección te ayudará a aprender las señas del tema{' '}
            <b>{lessonDetails.name}</b>.
          </p>
          <p className="practice-lesson-description">
            Encontrarás cada seña en video junto con su significado en español.
          </p>
          <div className="practice-lesson-start">
            <Button type="primary" size="large" onClick={handleOnNext}>
              Iniciar
            </Button>
          </div>
        </>
      )}

      {currentStep >= 1 && currentWord && (
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
              onClick={handleOnPrev}
              style={{
                display: currentStep > 1 ? '' : 'none',
              }}
            >
              Anterior
            </Button>
            <Button
              size="large"
              onClick={handleOnNext}
              style={{
                display: currentStep <= vocabularyKeys?.length ? '' : 'none',
              }}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      <Modal
        centered
        open={currentStep === vocabularyKeys?.length + 1}
        closable={false}
        footer={
          <>
            <Button
              size="large"
              onClick={() => {
                setCurrentStep(1);
              }}
            >
              Iniciar de nuevo
            </Button>
            <Button
              size="large"
              type="primary"
              onClick={() => {
                navigate('/dashboard');
              }}
            >
              Terminar
            </Button>
          </>
        }
      >
        <Result status="success" title="¡Felicidades, terminaste!" />
      </Modal>
    </section>
  );
}

export default LearnPracticeLesson;
