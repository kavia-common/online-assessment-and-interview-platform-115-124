import React from 'react';
import Card from '../../components/common/Card';
import CountdownTimer from '../../components/test/CountdownTimer';
import QuestionRender from '../../components/test/QuestionRender';
import Stepper from '../../components/common/Stepper';

const TestRunner = () => {
  return (
    <div className="container" style={{ display: 'grid', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <Stepper steps={['Intro', 'Section 1', 'Section 2', 'Review']} current={1} />
        <CountdownTimer />
      </div>
      <Card elevation="md">
        <QuestionRender />
      </Card>
    </div>
  );
};

export default TestRunner;
