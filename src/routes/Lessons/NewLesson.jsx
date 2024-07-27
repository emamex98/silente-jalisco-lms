import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { InboxOutlined } from '@ant-design/icons';
import VideoPlayer from '@components/Video/VideoPlayer';
import VideoCard from '@components/Video/VideoCard';
import { post } from '@libs/firebase/database';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  uploadFile,
  listFiles,
  formatItemName,
  getFileUrl,
} from '@libs/firebase/storage';
import {
  Steps,
  Upload,
  Input,
  Select,
  Button,
  Flex,
  Alert,
  Modal,
  Result,
  Divider,
} from 'antd';

import './Lessons.css';

const { Dragger } = Upload;

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
};

function NewLesson() {
  const [currentStep, setCurrentStep] = useState(0);
  const [vocabulary, setVocabulary] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lessonDetails, setLessonDetails] = useState({
    name: '',
    level: '',
  });

  const tagSectionRef = useRef(null);
  const topRef = useRef(null);
  const navigate = useNavigate();

  const handleOnLessonNext = async () => {
    setError(null);
    if (!lessonDetails.level || !lessonDetails.name) {
      setError(errors.MISSING_FIELDS);
      return;
    }
    setCurrentStep((i) => i + 1);
  };

  const handleUpload = async (e) => {
    const { file, onSuccess, onError } = e;

    setError(null);
    setIsLoading(true);

    try {
      const filePath = [
        lessonDetails.level,
        formatItemName(lessonDetails.name),
        uuidv4(),
      ].join('/');

      await uploadFile(file, filePath);

      onSuccess();
    } catch (e) {
      onError();
      setError({
        ...errors.UPLOAD_ERROR,
        description: e.toString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnUploadNext = async () => {
    const pathName = [
      lessonDetails.level,
      formatItemName(lessonDetails.name),
    ].join('/');

    try {
      setIsLoading(true);
      const videos = await listFiles(pathName);

      if (videos?.length) {
        const mappedVideos = {};

        for (const item of videos) {
          const id = item['_location']['path_'].split('/').pop();
          const src = await getFileUrl(item['_location']['path_']);
          const path = item['_location']['path_'];
          mappedVideos[id] = { id, src, path };
        }

        setVocabulary(mappedVideos);
        setCurrentStep((i) => i + 1);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnLabelChange = (id, value) => {
    setVocabulary((current) => {
      const newValue = { ...current };
      newValue[id].meaning = value;
      return newValue;
    });
  };

  const handleOnLabelNext = () => {
    setError(null);

    for (const key of Object.keys(vocabulary)) {
      if (!vocabulary[key].meaning) {
        setError(errors.MISSING_LABELS);
        tagSectionRef.current.scrollIntoView({
          behavior: 'smooth',
        });
        return;
      }
    }

    setCurrentStep((i) => i + 1);
    topRef.current.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const handlePost = async () => {
    const pathName = [
      'lessons',
      lessonDetails.level,
      formatItemName(lessonDetails.name),
    ].join('/');

    const vocabularyObject = vocabulary;

    Object.keys(vocabularyObject).forEach((key) => {
      delete vocabularyObject[key].src;
    });

    try {
      setIsLoading(true);
      await post(pathName, {
        styledName: lessonDetails.name,
        styledLevel: lessonDetails.level.toUpperCase(),
        content: vocabularyObject,
      });
      setShowModal(true);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnNext = () => {
    switch (currentStep) {
      case 0:
        handleOnLessonNext();
        break;
      case 1:
        handleOnUploadNext();
        break;
      case 2:
        handleOnLabelNext();
        break;
      case 3:
        handlePost();
        break;
    }
  };

  const handleOnPrev = () => {
    setCurrentStep((current) => current - 1);
  };

  const draggerProps = {
    name: 'vides',
    multiple: true,
    accept: 'video/*',
    customRequest: handleUpload,
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
              title: 'Subir videos',
            },
            {
              title: 'Etiquetar videos',
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
              options={[
                { value: 'a1', label: 'Nivel A1' },
                { value: 'a2', label: 'Nivel A2' },
                { value: 'b1', label: 'Nivel B1' },
                { value: 'b2', label: 'Nivel B2' },
                { value: 'c1', label: 'Nivel C1' },
                { value: 'c2', label: 'Nivel C2' },
              ]}
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
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Da clíc o arrastra aquí los videos.
            </p>
            <p className="ant-upload-hint">
              Puedes subir múltiples archivos a la vez.
            </p>
          </Dragger>
        </span>
      )}

      {currentStep === 2 && (
        <span ref={tagSectionRef}>
          <Flex wrap gap="large">
            {vocabulary &&
              Object.keys(vocabulary).map((key) => (
                <VideoCard
                  className="new-lessons-video-card"
                  key={key}
                  video={<VideoPlayer src={vocabulary[key].src} />}
                  value={vocabulary[key]?.meaning}
                  onChange={(e) => {
                    handleOnLabelChange(key, e.target.value);
                  }}
                />
              ))}
          </Flex>
        </span>
      )}

      {currentStep === 3 && (
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
            open={showModal}
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
          {currentStep !== 3 ? 'Siguiente' : 'Crear lección'}
        </Button>
      </span>
    </section>
  );
}

export default NewLesson;
