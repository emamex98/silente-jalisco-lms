import { Modal, Input, Form, Select } from 'antd';
import { LEVELS, USER_ACTIONS } from '@utils/constants';
import { createUser } from '@libs/firebase/authentication';
import { useEffect, useState } from 'react';
import { get, post } from '@libs/firebase/database';

function EditStudentModal({
  action,
  setOpenModal,
  openModal,
  setSuccessCount,
  currentData,
}) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  const handleCreateUser = async ({ name, email, level }) => {
    try {
      setConfirmLoading(true);
      const userCredential = await createUser(email);

      if (userCredential && userCredential.user.uid) {
        await post(`user_data/${userCredential.user.uid}`, {
          displayName: name,
          level,
          role: 'student',
          active: true,
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

  const handleEditUser = async ({ name, level, status }) => {
    try {
      setConfirmLoading(true);

      if (name && level && status !== undefined) {
        await post(`user_data/${currentData}`, {
          displayName: name,
          level,
          role: 'student',
          active: status === 'active',
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

  const handleSubmit = async ({ name, email, level, status }) => {
    if (action === USER_ACTIONS.CREATE) {
      await handleCreateUser({ name, email, level });
    }

    if (action === USER_ACTIONS.EDIT) {
      await handleEditUser({ name, level, status });
    }
  };

  const fetchStudentData = async () => {
    if (!currentData || !openModal) {
      return;
    }

    try {
      const response = await get(`user_data/${currentData}`);

      if (response) {
        form.setFieldsValue({
          name: response.displayName,
          level: response.level,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [openModal]);

  const title =
    action === USER_ACTIONS.CREATE
      ? 'Registrar un nuevo estudiante'
      : 'Editar datos de un estudiante';

  return (
    <Modal
      title={title}
      open={openModal}
      onOk={() => {
        form.submit();
      }}
      confirmLoading={confirmLoading}
      onCancel={handleModalCancel}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
        {action === USER_ACTIONS.CREATE && (
          <Form.Item
            label="Correo Electrónico"
            name="email"
            rules={[
              {
                required: action === USER_ACTIONS.CREATE,
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>
        )}
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
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={LEVELS}
          />
        </Form.Item>
        {action !== USER_ACTIONS.CREATE && (
          <Form.Item
            label="Estatus"
            name="status"
            rules={[
              {
                required: action !== USER_ACTIONS.CREATE,
              },
            ]}
          >
            <Select
              defaultValue="active"
              options={[
                { value: 'active', label: 'Activo' },
                { value: 'inactive', label: 'Inactivo' },
              ]}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

export default EditStudentModal;
