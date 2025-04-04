import { useState, useRef } from 'react';
import { Button, Input, Space, Modal, Result } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import VideoPlayer from '@components/Video/VideoPlayer';
import evaluateAnswer from '@utils/evaluateAnswer';

function PracticeScreen({ currentWord, onAnswered }) {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);
  const modalRef = useRef(null);

  const handleAnswer = () => {
    if (!currentAnswer) {
      return;
    }
    const assert = evaluateAnswer(currentAnswer, currentWord.meaning);
    setIsCurrentAnswerCorrect(assert);
    setOpenFeedbackModal(true);
  };

  const handleNext = () => {
    setOpenFeedbackModal(false);
    setCurrentAnswer('');
    onAnswered(isCurrentAnswerCorrect);
  };

  return (
    <div className="practice-lesson-vocabulary-container">
      <div key={currentWord.meaning}>
        <h1 className="practice-lesson-vocabulary-question">
          ¿Qué significa esta seña?
          <Space.Compact>
            <Input
              size="large"
              className="practice-lesson-vocabulary-question-input"
              value={currentAnswer}
              onChange={(e) => {
                setCurrentAnswer(e.target.value);
              }}
              onPressEnter={() => currentAnswer && handleAnswer()}
              autoFocus
            />
            <Button size="large" type="primary" onClick={handleAnswer}>
              <ArrowRightOutlined />
            </Button>
          </Space.Compact>
        </h1>

        <VideoPlayer
          src={currentWord.src}
          customControls
          autoPlay
          width="100%"
        />
      </div>

      <Modal
        centered
        open={openFeedbackModal}
        closable={false}
        footer={
          <>
            <Button size="large" onClick={handleNext} ref={modalRef}>
              Siguiente
            </Button>
          </>
        }
        afterOpenChange={(open) => open && modalRef.current?.focus()}
      >
        {isCurrentAnswerCorrect && (
          <Result status="success" title="Respuesta correcta" />
        )}
        {!isCurrentAnswerCorrect && (
          <Result
            status="error"
            title="Respuesta incorrecta"
            subTitle={
              <>
                La respuesta correcta es <b>{currentWord?.meaning}</b>.
              </>
            }
          />
        )}
      </Modal>
    </div>
  );
}

export default PracticeScreen;
