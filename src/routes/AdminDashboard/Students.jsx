import { Button, Table, Flex } from 'antd';
import { get } from '@libs/firebase/database';
import { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import EditStudentModal from '@components/Modal/EditStudentModal';
import { USER_ACTIONS } from '@utils/constants';

function ActionButtons({
  userId,
  setCurrentData,
  setUserAction,
  setOpenModal,
}) {
  return (
    <Flex gap={10}>
      <Button
        icon={<EditOutlined />}
        onClick={() => {
          setCurrentData(userId);
          setUserAction(USER_ACTIONS.EDIT);
          setOpenModal(true);
        }}
      >
        Editar
      </Button>
      <Button icon={<DeleteOutlined />} disabled>
        Borrar
      </Button>
    </Flex>
  );
}

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

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await get('user_data/');

      if (response) {
        const mappedStudents = [];
        Object.keys(response).forEach((userId) => {
          const user = response[userId];
          if (user.role === 'student') {
            mappedStudents.push({
              id: userId,
              key: userId,
              actions: (
                <ActionButtons
                  userId={userId}
                  setCurrentData={setCurrentData}
                  setUserAction={setUserAction}
                  setOpenModal={setOpenModal}
                />
              ),
              ...user,
              level: user.level.toUpperCase(),
            });
          }
        });
        setData(mappedStudents);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (sucessCount > 0) {
      fetchStudents();
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
