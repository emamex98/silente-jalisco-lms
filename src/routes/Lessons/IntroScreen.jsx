import { Button } from 'antd';
import { MODES } from '@utils/constants';

function IntroScreen({ lessonDetails, onStart, mode }) {
  return (
    <>
      <h1 className="practice-lesson-title">
        {lessonDetails.level} - {lessonDetails.name}
      </h1>
      <p className="practice-lesson-description">
        Esta sección te ayudará a aprender las señas del tema{' '}
        <b>{lessonDetails.name}</b>.
      </p>
      {mode === MODES.LEARN && (
        <p className="practice-lesson-description">
          Encontrarás cada seña en video junto con su significado en español.
        </p>
      )}
      {mode === MODES.PRACTICE && (
        <p className="practice-lesson-description">
          Tendrás que ver la seña y escribir su significado en el recuadro.
        </p>
      )}
      <div className="practice-lesson-start">
        <Button type="primary" size="large" onClick={onStart}>
          Iniciar
        </Button>
      </div>
    </>
  );
}

export default IntroScreen;
