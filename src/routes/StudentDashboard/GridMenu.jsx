import { Card, Divider } from 'antd';
import { MODES, MODE_LABELS } from '@utils/constants';

function GridMenu({ userData, setCurrentView }) {
  const { name, level } = userData;

  return (
    <section>
      {name && (
        <h1 className="student-dashboard-title">
          👋 <br /> ¡Hola, {name}!
        </h1>
      )}

      <Divider />
      <h2 className="student-dashboard-subtitle">Nivel {level}</h2>
      <div className="grid-menu">
        {Object.values(MODES).map((mode) => (
          <Card
            hoverable={MODE_LABELS[mode].enabled}
            className="grid-menu-item"
            onClick={() => {
              if (MODE_LABELS[mode].enabled) {
                setCurrentView(mode);
              }
            }}
            key={mode}
          >
            <h3>
              {MODE_LABELS[mode].emoji} <br /> {MODE_LABELS[mode].shortName}
            </h3>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default GridMenu;
