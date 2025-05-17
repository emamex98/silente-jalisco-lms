import { Button, Table, Flex, Dropdown, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { get, post, remove } from '@libs/firebase/database';
import { deleteFolder } from '@libs/firebase/storage';
import { useEffect, useState } from 'react';
import {
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';

function ActionButtons({ path, isVisible, refresher }) {
  const navigate = useNavigate();

  const deleteLesson = async (path) => {
    try {
      await remove(path.replace('/lecciones/', '/lessons/'));
      await deleteFolder(path.replace('/lecciones', ''));
      refresher((i) => i + 1);
    } catch (e) {
      console.log(e);
    }
  };

  const toggleLessonVisbility = async (path) => {
    try {
      const lessonVisibilityPath = `${path.replace('/lecciones/', '/lessons/')}/isVisible`;
      const resp = await post(lessonVisibilityPath, !isVisible);
      refresher((i) => i + 1);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Flex gap={10}>
      <Button
        icon={<ExportOutlined />}
        onClick={() => {
          navigate(path);
        }}
      >
        Abrir
      </Button>
      {/* <Button icon={<EditOutlined />} disabled>
        Editar
      </Button> */}
      <Button
        icon={isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        onClick={() => {
          toggleLessonVisbility(path);
        }}
      >
        {isVisible ? 'Ocultar' : 'Mostrar'}
      </Button>
      <Button
        icon={<DeleteOutlined />}
        onClick={() => {
          deleteLesson(path);
        }}
      >
        Borrar
      </Button>
    </Flex>
  );
}

function Lessons() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: '300px',
    },
    {
      title: 'Nivel',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'Visibilidad',
      dataIndex: 'isVisible',
      key: 'isVisible',
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
    },
  ];

  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      const response = await get('lessons/');

      if (response) {
        const mappedLessons = [];
        Object.keys(response).forEach((levelKey) => {
          const level = response[levelKey];
          const lessons = Object.keys(level).map((lessonKey) => ({
            name: response[levelKey][lessonKey].styledName,
            level: response[levelKey][lessonKey].styledLevel,
            key: `${levelKey}-${lessonKey}`,
            isVisible: response[levelKey][lessonKey].isVisible ? (
              <Tag color="success">Visible</Tag>
            ) : (
              <Tag color="error">Oculta</Tag>
            ),
            actions: (
              <ActionButtons
                path={`/lecciones/${levelKey}/${lessonKey}`}
                isVisible={response[levelKey][lessonKey].isVisible}
                refresher={setRefreshCount}
              />
            ),
          }));
          mappedLessons.push(...lessons);
        });

        setData(mappedLessons);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [refreshCount]);

  const items = [
    {
      label: 'Subir videos existentes',
      key: '1',
      onClick: () => {
        navigate('/lecciones/subir');
      },
    },
    {
      label: 'Grabar videos nuevos',
      key: '2',
      onClick: () => {
        navigate('/lecciones/grabar');
      },
    },
  ];

  return (
    <>
      <Flex justify="space-between" align="center">
        <h2>Lecciones</h2>

        <Dropdown menu={{ items }} trigger="click">
          <Button type="primary" icon={<PlusOutlined />}>
            Nueva Lección
          </Button>
        </Dropdown>
      </Flex>
      <Table columns={columns} dataSource={data} loading={isLoading} />
    </>
  );
}

export default Lessons;
