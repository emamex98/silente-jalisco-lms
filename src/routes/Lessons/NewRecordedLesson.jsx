import { useState, useEffect, useRef } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { LEVELS } from '@utils/constants';
import { v4 as uuidv4 } from 'uuid';
import { post, get } from '@libs/firebase/database';
import { useNavigate, Link } from 'react-router-dom';
import { uploadFile, formatItemName, getFileUrl } from '@libs/firebase/storage';

import VideoCard from '@components/Video/VideoCard';
import VideoPlayer from '@components/Video/VideoPlayer';
import VideoRecorder from 'react-video-recorder';

import {
  Steps,
  Button,
  Alert,
  Flex,
  Input,
  Select,
  Modal,
  Card,
  Result,
  Divider,
} from 'antd';

const errors = {
  MISSING_FIELDS: {
    title: '¡Algunos campos están vacíos!',
    description: 'Revisa que todos los campos esten completos antes de seguir.',
  },
  MISSING_LABELS: {
    title: '¡Algunos videos no están etiquetados!',
    description:
      'Es necesario escribir el significado de cada seña antes de continuar.',
  },
  UPLOAD_ERROR: {
    title: '¡Algo falló al intentar subir los archivos!',
  },
  POST_ERROR: {
    title: '¡Algo falló al intentar guardar la lección!',
  },
};

const t = (key) => {
  switch (key) {
    case 'Turn my camera ON':
      return 'Encender la cámara';
    case 'Record a video':
      return 'Grabar un video';
    case 'Use another video':
      return 'Grabar de nuevo';
    case 'PRESS':
      return 'PRESIONA';
    case 'WHEN READY':
      return 'PARA INICIAR LA GRABACIÓN';
    default:
      return key;
  }
};

function NewRecordedLesson() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [lessonDetails, setLessonDetails] = useState({
    name: '',
    level: '',
  });

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showRecorder, setShowRecorder] = useState(true);
  const [currentRecordedVideo, setCurrentRecordedVideo] = useState(null);
  const [currentRecordedVideoSrc, setCurrentRecordedVideoSrc] = useState('');
  const [currentVideoLabel, setCurrentVideoLabel] = useState('');
  const [currentVideoLabelError, setCurrentVideoLabelError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [vocabulary, setVocabulary] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const navigate = useNavigate();
  const topRef = useRef(null);

  useEffect(() => {
    const fetchLessonContent = async () => {
      try {
        setIsLoading(true);

        const pathName = [
          'lessons',
          lessonDetails.level,
          formatItemName(lessonDetails.name),
          'content',
        ].join('/');

        const content = await get(pathName);

        if (Object.keys(content)) {
          const mappedVideos = {};
          for (const key in content) {
            mappedVideos[key] = {
              ...content[key],
              src: await getFileUrl(content[key].path),
              path: content[key].path,
            };
          }

          setVocabulary(mappedVideos);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonContent();
  }, [lessonDetails.level, lessonDetails.name, showVideoModal]);

  const handleOnPrev = () => {
    topRef.current.scrollIntoView({
      behavior: 'smooth',
    });

    setCurrentStep((current) => current - 1);
  };

  const handleOnNext = () => {
    topRef.current.scrollIntoView({
      behavior: 'smooth',
    });

    switch (currentStep) {
      case 0:
        validateLessonDetails();
        break;
      case 1:
        setCurrentStep((i) => i + 1);
        break;
      case 2:
        saveLesson();
        break;
    }
  };

  const validateLessonDetails = async () => {
    setError(null);
    if (!lessonDetails.level || !lessonDetails.name) {
      setError(errors.MISSING_FIELDS);
      return;
    }
    setCurrentStep((i) => i + 1);
  };

  const onRecordingComplete = (video) => {
    setCurrentRecordedVideo(video);
    setCurrentRecordedVideoSrc(window.URL.createObjectURL(video));
    setShowRecorder(false);
  };

  const uploadAndLabelVideo = async () => {
    setCurrentVideoLabelError('');

    if (!currentVideoLabel) {
      setCurrentVideoLabelError('error');
      return;
    }

    try {
      setIsUploading(true);
      const fileId = uuidv4();

      const filePath = [
        lessonDetails.level,
        formatItemName(lessonDetails.name),
        fileId,
      ].join('/');

      const { metadata } = await uploadFile(currentRecordedVideo, filePath);

      const pathName = [
        'lessons',
        lessonDetails.level,
        formatItemName(lessonDetails.name),
        'content',
        fileId,
      ].join('/');

      const wordObject = {
        id: fileId,
        meaning: currentVideoLabel,
        path: metadata.fullPath,
      };

      await post(pathName, wordObject);
      resetRecorderModal();
    } catch (e) {
      setError({
        ...errors.UPLOAD_ERROR,
        description: e.toString(),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetRecorderModal = () => {
    setShowRecorder(true);
    setShowVideoModal(false);
    setCurrentVideoLabel('');
    setCurrentVideoLabelError('');
  };

  const saveLesson = async () => {
    try {
      const pathName = [
        'lessons',
        lessonDetails.level,
        formatItemName(lessonDetails.name),
      ].join('/');

      await post(`${pathName}/styledName`, lessonDetails.name);
      await post(`${pathName}/styledLevel`, lessonDetails.level.toUpperCase());
      await post(`${pathName}/isVisible`, true);

      setShowConfirmationModal(true);
    } catch (e) {
      setError({
        ...errors.POST_ERROR,
        description: e.toString(),
      });
    }
  };

  return (
    <section className="new-lessons-container">
      <span>
        <Link to="/dashboard">
          <ArrowLeftOutlined />
          {` Regresar al inicio`}
        </Link>
        <Divider />
      </span>

      <span ref={topRef}>
        <h1>Nueva Lección</h1>
      </span>

      <span>
        <Steps
          current={currentStep}
          items={[
            {
              title: 'Datos iniciales',
            },
            {
              title: 'Grabar videos',
            },
            {
              title: 'Confirmar detalles',
            },
          ]}
        />
      </span>

      {error && (
        <Alert
          message={error.title}
          description={error.description}
          type="error"
          showIcon
        />
      )}

      {currentStep === 0 && (
        <span className="new-lesson-max-width">
          <Flex vertical>
            <p className="new-lesson-form-label">
              <b>Nombre de la lección</b>
              <br />
              <i>¿Cuál es el tema de esta lección?</i>
            </p>

            <Input
              size="large"
              placeholder="Ejemplos: Familia, Calendario, Colores..."
              value={lessonDetails.name}
              onChange={(e) => {
                setLessonDetails((current) => ({
                  ...current,
                  name: e.target.value,
                }));
              }}
            />

            <p className="new-lesson-form-label">
              <b>Nivel de la lección</b>
              <br />
              <i>¿A qué nivel pertenece esta lección?</i>
            </p>

            <Select
              size="large"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={LEVELS}
              value={lessonDetails.level}
              onChange={(level) => {
                setLessonDetails((current) => ({
                  ...current,
                  level,
                }));
              }}
            />
          </Flex>
        </span>
      )}

      {currentStep === 1 && (
        <span>
          <Flex wrap gap="large">
            {vocabulary &&
              Object.keys(vocabulary).map((key) => (
                <VideoCard
                  className="new-lessons-video-card"
                  key={key}
                  video={<VideoPlayer src={vocabulary[key].src} />}
                  title={vocabulary[key].meaning}
                />
              ))}

            <Card className="new-lesson-record-action-card">
              <div className="new-lesson-record-action-card-content">
                <Button
                  onClick={() => {
                    setShowVideoModal(true);
                  }}
                  type="primary"
                  size="large"
                >
                  Grabar nuevo video
                </Button>
              </div>
            </Card>
          </Flex>

          <Modal
            centered
            title="Grabar nuevo video"
            open={showVideoModal}
            onCancel={resetRecorderModal}
            footer={
              <>
                <Button disabled={isUploading} onClick={resetRecorderModal}>
                  Cancelar
                </Button>
                {!showRecorder && (
                  <Button
                    loading={isUploading}
                    type="primary"
                    onClick={uploadAndLabelVideo}
                  >
                    Guardar
                  </Button>
                )}
              </>
            }
          >
            {showRecorder && (
              <VideoRecorder
                constraints={{
                  audio: false,
                  video: true,
                }}
                onRecordingComplete={onRecordingComplete}
                t={t}
              />
            )}
            {!showRecorder && (
              <>
                <VideoPlayer src={currentRecordedVideoSrc} autoPlay />
                <p>
                  <b>¿Qué seña es esta?</b>
                </p>
                <Input
                  value={currentVideoLabel}
                  onChange={(e) => {
                    setCurrentVideoLabelError('');
                    setCurrentVideoLabel(e.target.value);
                  }}
                  status={currentVideoLabelError}
                />
                <br />
                <br />
              </>
            )}
          </Modal>
        </span>
      )}

      {currentStep === 2 && (
        <span>
          <Alert
            message="Confirma que la información sea correcta."
            type="info"
            showIcon
          />

          <h2>
            Lección: {lessonDetails.name} - Nivel:{' '}
            {lessonDetails.level.toUpperCase()}
          </h2>

          <Flex wrap gap="large">
            {vocabulary &&
              Object.keys(vocabulary).map((key) => (
                <VideoCard
                  className="new-lessons-video-card"
                  key={key}
                  video={<VideoPlayer src={vocabulary[key].src} />}
                  title={vocabulary[key].meaning}
                />
              ))}
          </Flex>

          <Modal
            centered
            open={showConfirmationModal}
            closable={false}
            footer={
              <Button
                type="primary"
                onClick={() => {
                  navigate('/dashboard');
                }}
              >
                Terminar
              </Button>
            }
          >
            <Result
              status="success"
              title="¡La lección se creó exitosamente!"
            />
          </Modal>
        </span>
      )}

      <span className="new-lesson-navigation">
        <Button
          size="large"
          onClick={handleOnPrev}
          disabled={isLoading}
          style={{
            visibility: currentStep !== 0 ? 'visible' : 'hidden',
          }}
        >
          Anterior
        </Button>
        <Button disabled={isLoading} size="large" onClick={handleOnNext}>
          {currentStep !== 2 ? 'Siguiente' : 'Crear lección'}
        </Button>
      </span>
    </section>
  );
}

export default NewRecordedLesson;
