import { Divider, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import { get } from '@libs/firebase/database';
import { AuthContext } from '@context/auth-context';
import { MODE_LABELS } from '@utils/constants';
import { useNavigate } from 'react-router-dom';

function LessonList({ returnToMain, mode }) {
  const { userData } = useContext(AuthContext);
  const { level } = userData;
  const navigate = useNavigate();

  const [lessons, setLessons] = useState(null);
  const [lessonKeys, setLessonKeys] = useState([]);

  const fetchLessons = async () => {
    // setIsLoading(true);
    try {
      const response = await get(`lessons/${level.toLowerCase()}`);
      setLessons(response);
      setLessonKeys(response ? Object.keys(response) : []);
    } catch (e) {
      console.error(e);
    } finally {
      //   setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return (
    <section className="lesson-list">
      <div>
        <Link onClick={returnToMain}>
          <ArrowLeftOutlined />
          {` Regresar al inicio`}
        </Link>
        <Divider />
      </div>
      <h1 className="lesson-list-title">
        {MODE_LABELS[mode].emoji} <br /> {MODE_LABELS[mode].name}
      </h1>
      <Divider />
      <div className="lesson-list-grid">
        {lessonKeys.length > 0 &&
          lessonKeys.map((lessonKey) => {
            const {
              styledName: name,
              styledLevel: level,
              isVisible,
            } = lessons[lessonKey];

            if (!isVisible) {
              return null;
            }

            return (
              <Card
                hoverable
                className="lesson-list-grid-item"
                key={`${level}-${name}`}
                onClick={() => {
                  navigate(
                    `/lecciones/${level.toLowerCase()}/${lessonKey}/${MODE_LABELS[mode].shortName.toLowerCase()}`
                  );
                }}
              >
                {name}
              </Card>
            );
          })}
      </div>
    </section>
  );
}

export default LessonList;
