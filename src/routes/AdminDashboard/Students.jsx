import { Button, Table, Flex, Modal, Input, Form, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { get, post } from '@libs/firebase/database';
import { useEffect, useState } from 'react';
import { createUser } from '@libs/firebase/authentication';
import {
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';

function ActionButtons({ userId }) {
  return (
    <Flex gap={10}>
      <Button icon={<EditOutlined />} disabled>
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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [sucessCount, setSuccessCount] = useState(0);
  const [form] = Form.useForm();

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

  const handleSubmit = async ({ name, email, level }) => {
    try {
      setConfirmLoading(true);
      const userCredential = await createUser(email);
      if (userCredential && userCredential.user.uid) {
        await post(`user_data/${userCredential.user.uid}`, {
          displayName: name,
          level,
          role: 'student',
        });
      }
      setOpenModal(false);
      setSuccessCount((i) => i + 1);
    } catch (e) {
      console.log(e);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleModalCancel = () => {
    setOpenModal(false);
    form.resetFields();
  };

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
              actions: <ActionButtons userId={userId} />,
              ...user,
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
            setOpenModal(true);
          }}
          icon={<PlusOutlined />}
        >
          Agregar Estudiante
        </Button>
      </Flex>
      <Table columns={columns} dataSource={data} loading={isLoading} />

      <Modal
        title="Registrar un nuevo estudiante"
        open={openModal}
        onOk={() => {
          form.submit();
        }}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: '',
            email: '',
            level: 'a1',
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Nombre y Apellido"
            name="name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Correo Electrónico"
            name="email"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Nivel"
            name="level"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
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
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Students;
