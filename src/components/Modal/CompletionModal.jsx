import { Button, Modal, Result } from 'antd';
import { MODES } from '@utils/constants';

import './CompletionModal.css';

function CompletionModal({ isOpen, mode, results, onRestart, onFinish }) {
  const { score, assertCount, totalCount, incorrectAnswers } = results;

  return (
    <Modal
      centered
      open={isOpen}
      closable={false}
      footer={
        <>
          <Button size="large" onClick={onRestart}>
            Iniciar de nuevo
          </Button>
          <Button size="large" type="primary" onClick={onFinish}>
            Terminar
          </Button>
        </>
      }
    >
      {mode === MODES.LEARN && (
        <Result status="success" title="¡Felicidades, terminaste!" />
      )}

      {mode === MODES.PRACTICE && (
        <>
          <Result
            status={score >= 80 ? 'success' : 'error'}
            title={`Aciertos: ${assertCount}/${totalCount} - Calificación: ${score}%`}
          />
          {incorrectAnswers.length > 0 && (
            <p className="feedback-paragraph">
              <b>
                Repasa estas señas: <br />
              </b>

              {incorrectAnswers.map((item) => item.word).join(', ')}
            </p>
          )}
        </>
      )}
    </Modal>
  );
}

export default CompletionModal;
