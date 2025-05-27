import { Button, Table, Flex, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import EditStudentModal from '@components/Modal/EditStudentModal';
import { getFormattedStudents } from '../../services/studentsService'; // Import service
import ActionButtons from '@components/ActionButtons/ActionButtons';
import { USER_ACTIONS, LEVELS } from '@utils/constants';

function Students() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [userAction, setUserAction] = useState(USER_ACTIONS.CREATE);
  const [sucessCount, setSuccessCount] = useState(0);
  const [currentData, setCurrentData] = useState(null);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'displayName',
      key: 'displayName',
      width: '270px',
      sorter: (a, b) => a.displayName.localeCompare(b.displayName),
    },
    {
      title: 'Nivel',
      dataIndex: 'level',
      key: 'level',
      filterMode: 'menu',
      filters: Object.keys(LEVELS).map((key) => ({
        text: LEVELS[key].label,
        value: LEVELS[key].value.toUpperCase(),
      })),
      onFilter: (value, record) => record.level === value,
      filterMultiple: true,
    },
    {
      title: 'Estatus',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
    },
  ];

  const loadStudents = async () => { // Renamed from fetchStudents
    setIsLoading(true);
    try {
      const studentsData = await getFormattedStudents(); // Call service

      if (studentsData) {
        const mappedStudents = studentsData.map((student) => ({
          ...student, // Spread student data from service
          key: student.id, // Use student.id for key
          actions: (() => {
            const actionItems = [
              {
                key: 'edit',
                icon: <EditOutlined />,
                text: 'Editar',
                onClick: () => {
                  setCurrentData(student.id); // Use student.id
                  setUserAction(USER_ACTIONS.EDIT);
                  setOpenModal(true);
                },
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                text: 'Eliminar',
                onClick: () => {
                  setCurrentData(student.id); // Use student.id
                  setUserAction(USER_ACTIONS.DELETE);
                  setOpenModal(true);
                },
                danger: true,
              },
            ];
            return <ActionButtons items={actionItems} />;
          })(),
          level: student.level ? student.level.toUpperCase() : 'N/A', // Handle undefined level
          status: student.active ? (
            <Tag color="success">Activo</Tag>
          ) : (
            <Tag color="error">Inactivo</Tag>
          ),
        }));
        setData(mappedStudents);
      }
    } catch (e) {
      console.error('Error loading students for display:', e);
      setData([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []); // Initial load

  useEffect(() => {
    if (sucessCount > 0) {
      loadStudents(); // Refresh data when successCount changes
    }
  }, [sucessCount]);

  return (
    <>
      <Flex justify="space-between" align="center">
        <h2>Estudiantes</h2>
        <Button
          type="primary"
          onClick={() => {
            setUserAction(USER_ACTIONS.CREATE);
            setOpenModal(true);
          }}
          icon={<PlusOutlined />}
        >
          Agregar Estudiante
        </Button>
      </Flex>
      <Table columns={columns} dataSource={data} loading={isLoading} />

      <EditStudentModal
        action={userAction}
        setOpenModal={setOpenModal}
        openModal={openModal}
        setSuccessCount={setSuccessCount}
        currentData={currentData}
      />
    </>
  );
}

export default Students;
