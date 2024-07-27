import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { get } from '@libs/firebase/database';
import { getFileUrl } from '@libs/firebase/storage';
import { Flex, Divider, Alert } from 'antd';
import VideoCard from '@components/Video/VideoCard';
import VideoPlayer from '@components/Video/VideoPlayer';
import { ArrowLeftOutlined } from '@ant-design/icons';

const errors = {
  NO_RESULTS_RETURNED: {
    title: 'La lección que buscas no se encontró.',
    description: 'Puede que se haya eliminado o que la liga esté mal escrita.',
  },
  STORAGE_ERROR: {
    title: '¡Algo falló al intentar cargar los archivos!',
  },
};

function ManageLesson() {
  const { level, name } = useParams();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vocabulary, setVocabulary] = useState(null);
  const [lessonDetails, setLessonDetails] = useState({
    name: '',
    level: '',
  });

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
      }
    } catch (e) {
      console.error(e);
      setError({
        ...errors.STORAGE_ERROR,
        description: e.toString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setError(null);
    const lessonPath = `${level}/${name}`;
    fetchLessonDetails(lessonPath);
  }, [level, name]);

  return (
    <section className="manage-lessons-container">
      <span>
        <Link to="/dashboard">
          <ArrowLeftOutlined />
          {` Regresar al inicio`}
        </Link>
        <Divider />
      </span>

      {error && (
        <Alert
          message={error.title}
          description={error.description}
          type="error"
          showIcon
        />
      )}

      {vocabulary && (
        <span>
          <h1>
            Lección: {lessonDetails.name} - Nivel: {lessonDetails.level}
          </h1>
        </span>
      )}

      <Flex wrap gap="large">
        {isLoading && (
          <>
            {Array.from({ length: 10 }, (_) => []).map((_, index) => (
              <VideoCard
                key={index}
                loading={isLoading}
                style={{ width: '22vw' }}
              />
            ))}
          </>
        )}

        {vocabulary && (
          <>
            {vocabulary &&
              Object.keys(vocabulary).map((key) => (
                <VideoCard
                  className="new-lessons-video-card"
                  key={key}
                  video={<VideoPlayer src={vocabulary[key].src} />}
                  title={vocabulary[key].meaning}
                />
              ))}
          </>
        )}
      </Flex>
    </section>
  );
}

export default ManageLesson;
