import { Button, Table, Flex, Dropdown, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ExportOutlined,
  // EditOutlined, // Not used, can be removed if not planned for future
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import ActionButtons from '@components/ActionButtons/ActionButtons';
import {
  getFormattedLessons,
  deleteLesson as deleteLessonService,
  toggleLessonVisibility as toggleLessonVisibilityService,
} from '../../services/lessonsService'; // Adjusted path

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
      dataIndex: 'isVisibleTag', // Changed from isVisible to avoid conflict if isVisible boolean is needed
      key: 'isVisibleTag',
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
    },
  ];

  const loadLessons = async () => {
    setIsLoading(true);
    try {
      const lessonsData = await getFormattedLessons();
      const processedData = lessonsData.map((lesson) => ({
        ...lesson,
        isVisibleTag: lesson.isVisible ? (
          <Tag color="success">Visible</Tag>
        ) : (
          <Tag color="error">Oculta</Tag>
        ),
        actions: (() => {
          const actionItems = [
            {
              key: 'open',
              icon: <ExportOutlined />,
              text: 'Abrir',
              onClick: () => navigate(lesson.path),
            },
            {
              key: 'toggleVisibility',
              icon: lesson.isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />,
              text: lesson.isVisible ? 'Ocultar' : 'Mostrar',
              onClick: async () => {
                try {
                  await toggleLessonVisibilityService(lesson.path, lesson.isVisible);
                  setRefreshCount((c) => c + 1);
                } catch (error) {
                  console.error('Failed to toggle visibility:', error);
                  // Optionally, show an error message to the user
                }
              },
            },
            {
              key: 'delete',
              icon: <DeleteOutlined />,
              text: 'Borrar',
              onClick: async () => {
                try {
                  // Consider adding a confirmation dialog here
                  await deleteLessonService(lesson.path);
                  setRefreshCount((c) => c + 1);
                } catch (error) {
                  console.error('Failed to delete lesson:', error);
                  // Optionally, show an error message to the user
                }
              },
              danger: true,
            },
          ];
          return <ActionButtons items={actionItems} />;
        })(),
      }));
      setData(processedData);
    } catch (e) {
      console.error('Error loading lessons for display:', e);
      // Optionally, set an error state to display a message to the user
      setData([]); // Clear data or set to an empty state on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, [refreshCount, navigate]); // Added navigate to dependencies as it's used in actions

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
