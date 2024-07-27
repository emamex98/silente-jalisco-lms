import { Button, Table, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import { get } from '@libs/firebase/database';
import { useEffect, useState } from 'react';
import {
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';

function ActionButtons({ path }) {
  const navigate = useNavigate();
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
      <Button icon={<EditOutlined />} disabled>
        Editar
      </Button>
      <Button icon={<DeleteOutlined />} disabled>
        Borrar
      </Button>
    </Flex>
  );
}

function Lessons() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
            actions: (
              <ActionButtons path={`/lecciones/${levelKey}/${lessonKey}`} />
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
  }, []);

  return (
    <>
      <Flex justify="space-between" align="center">
        <h2>Lecciones</h2>
        <Button
          type="primary"
          onClick={() => {
            navigate('/lecciones/nueva');
          }}
          icon={<PlusOutlined />}
        >
          Nueva Lección
        </Button>
      </Flex>
      <Table columns={columns} dataSource={data} loading={isLoading} />
    </>
  );
}

export default Lessons;
