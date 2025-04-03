import { Result } from 'antd';

import './StudentDashboard.css';

function StudentError() {
  return (
    <Result
      status="warning"
      title="Tu cuenta está inactiva"
      subTitle="Puede que tu inscripción haya vencido o no estás al corriente con tus pagos."
    />
  );
}

export default StudentError;
