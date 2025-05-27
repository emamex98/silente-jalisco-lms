import { Modal, Input, Form, Select } from 'antd';
import { LEVELS, USER_ACTIONS } from '@utils/constants';
import { useEffect, useState } from 'react';
import { get } from '@libs/firebase/database'; // Keep get for fetchStudentData
import {
  createStudent,
  updateStudent,
  deleteStudent,
} from '../../services/studentsService'; // Import service functions

function EditStudentModal({
  action,
  setOpenModal,
  openModal,
  setSuccessCount,
  currentData,
}) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [userName, setUserName] = useState('');

  const handleModalCancel = () => {
    setOpenModal(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    const { name, email, level, status } = values;
    setConfirmLoading(true);
    try {
      if (action === USER_ACTIONS.CREATE) {
        // Assuming password needs to be handled; service expects it.
        // This is a placeholder as the original form didn't collect password.
        await createStudent({ displayName: name, email, level, password: 'defaultPassword' });
      } else if (action === USER_ACTIONS.EDIT) {
        await updateStudent(currentData, { displayName: name, level, active: status === 'active' });
      }
      setOpenModal(false);
      setSuccessCount((i) => i + 1);
    } catch (e) {
      console.error('Error submitting form:', e);
      // TODO: Show error message to user via antd Message or Notification
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDelete = async () => {
    setConfirmLoading(true);
    try {
      await deleteStudent(currentData);
      setOpenModal(false);
      setSuccessCount((i) => i + 1);
    } catch (e) {
      console.error('Error deleting student:', e);
      // TODO: Show error message to user
    } finally {
      setConfirmLoading(false);
    }
  };

  // fetchStudentData remains as is for now, as it's for pre-filling the form.
  // Ideally, this could also be a service call like getStudentById(currentData).
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
          status: response.active ? 'active' : 'inactive',
        });
        setUserName(response.displayName);
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

  if (action === USER_ACTIONS.DELETE) {
    return (
      <Modal
        title="Eliminar cuenta de un estudiante"
        open={openModal}
        onOk={handleDelete} // Use new handleDelete
        okText="Eliminar"
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
        cancelText="Cancelar"
      >
        Confirma que deseas borrar la cuenta de <b>{userName}</b>.
      </Modal>
    );
  }

  return (
    <Modal
      title={title}
      open={openModal}
      onOk={() => {
        form.submit();
      }}
      confirmLoading={confirmLoading}
      onCancel={handleModalCancel}
      cancelText="Cancelar"
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
