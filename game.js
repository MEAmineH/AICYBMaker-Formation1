const questions = [
  {
    domain: 'Security and Risk Management',
    prompt: 'A business owner wants to accept a high residual risk after a treatment plan. Who should make the final risk acceptance decision?',
    answers: [
      { text: 'The system owner or senior business decision maker accountable for the asset', type: 'correct' },
      { text: 'The security analyst who discovered the risk', type: 'close' },
      { text: 'The internal audit team after the next audit cycle', type: 'close' },
      { text: 'The vendor that supports the affected system', type: 'wrong' },
    ],
    explanation: 'CISSP questions usually expect risk decisions to be owned by management or the accountable business owner, while security teams advise and document.',
  },
  {
    domain: 'Asset Security',
    prompt: 'Which activity is most important when determining how sensitive data should be protected throughout its lifecycle?',
    answers: [
      { text: 'Classifying and labeling the data according to business impact', type: 'correct' },
      { text: 'Encrypting every file with the same organization-wide key', type: 'close' },
      { text: 'Keeping all data forever for future investigations', type: 'wrong' },
      { text: 'Moving the data to the newest storage platform', type: 'close' },
    ],
    explanation: 'Classification drives handling, retention, access, and protection requirements. Controls should match the data value and risk.',
  },
  {
    domain: 'Security Architecture and Engineering',
    prompt: 'A team designs a service so that a compromise of one component does not expose unrelated secrets. Which principle is being applied?',
    answers: [
      { text: 'Compartmentalization', type: 'correct' },
      { text: 'Security through obscurity', type: 'wrong' },
      { text: 'Defense in depth', type: 'close' },
      { text: 'Fail-open resilience', type: 'close' },
    ],
    explanation: 'Compartmentalization limits blast radius. Defense in depth is related but focuses on layered controls rather than separating secrets by component.',
  },
  {
    domain: 'Communication and Network Security',
    prompt: 'Which control best reduces the chance that an attacker can move laterally from a user workstation subnet to a payment processing subnet?',
    answers: [
      { text: 'Network segmentation with tightly controlled firewall rules', type: 'correct' },
      { text: 'A longer password history setting on workstations', type: 'close' },
      { text: 'Disabling logs to avoid exposing payment data', type: 'wrong' },
      { text: 'A banner warning users that monitoring is active', type: 'close' },
    ],
    explanation: 'Segmentation and access control between zones directly restrict lateral movement paths between different trust levels.',
  },
  {
    domain: 'Identity and Access Management',
    prompt: 'An administrator needs temporary elevated access for a production change. Which approach best supports least privilege?',
    answers: [
      { text: 'Just-in-time privileged access with approval and automatic expiration', type: 'correct' },
      { text: 'A shared administrator account stored in a team password vault', type: 'close' },
      { text: 'Permanent domain administrator membership', type: 'wrong' },
      { text: 'Monthly review of all administrator accounts', type: 'close' },
    ],
    explanation: 'Temporary, approved elevation grants only the access needed for the task and removes it when the need ends.',
  },
  {
    domain: 'Security Assessment and Testing',
    prompt: 'What is the primary purpose of a penetration test compared with an automated vulnerability scan?',
    answers: [
      { text: 'To validate exploitability and business impact through controlled attack techniques', type: 'correct' },
      { text: 'To replace the need for risk assessment', type: 'wrong' },
      { text: 'To enumerate known missing patches quickly', type: 'close' },
      { text: 'To prove that every vulnerability has been found', type: 'close' },
    ],
    explanation: 'Penetration testing goes beyond discovery by safely demonstrating attack paths and impact. It never proves complete absence of flaws.',
  },
  {
    domain: 'Security Operations',
    prompt: 'During incident response, when should evidence handling procedures and chain of custody begin?',
    answers: [
      { text: 'As soon as evidence may be collected or preserved', type: 'correct' },
      { text: 'Only after law enforcement arrives on site', type: 'close' },
      { text: 'After the system has been rebuilt from backups', type: 'wrong' },
      { text: 'When the final lessons-learned report is drafted', type: 'close' },
    ],
    explanation: 'Evidence integrity depends on documenting custody and handling from the beginning of collection and preservation activities.',
  },
  {
    domain: 'Software Development Security',
    prompt: 'A development team wants to identify design flaws before writing code. Which practice is most appropriate?',
    answers: [
      { text: 'Threat modeling during the design phase', type: 'correct' },
      { text: 'Dynamic application scanning in production only', type: 'close' },
      { text: 'Ignoring abuse cases until after release', type: 'wrong' },
      { text: 'Changing passwords for developer accounts', type: 'close' },
    ],
    explanation: 'Threat modeling evaluates architecture, trust boundaries, and abuse cases early enough to influence design decisions.',
  },
  {
    domain: 'Business Continuity',
    prompt: 'A service must be restored within four hours after a disruption. What does the four-hour value represent?',
    answers: [
      { text: 'Recovery Time Objective (RTO)', type: 'correct' },
      { text: 'Recovery Point Objective (RPO)', type: 'close' },
      { text: 'Mean Time Between Failures (MTBF)', type: 'close' },
      { text: 'Annualized Loss Expectancy (ALE)', type: 'wrong' },
    ],
    explanation: 'RTO is the target time to restore service. RPO is about acceptable data loss measured in time.',
  },
  {
    domain: 'Governance',
    prompt: 'Which document should provide high-level management direction and mandatory expectations for information security?',
    answers: [
      { text: 'Security policy', type: 'correct' },
      { text: 'Step-by-step build procedure', type: 'close' },
      { text: 'Individual firewall log entry', type: 'wrong' },
      { text: 'Technical configuration baseline', type: 'close' },
    ],
    explanation: 'Policies state management intent and mandatory requirements. Standards, baselines, and procedures provide more detailed implementation guidance.',
  },
];

const state = { index: 0, score: 0, streak: 0, locked: false };

const els = {
  count: document.querySelector('#question-count'),
  score: document.querySelector('#score'),
  streak: document.querySelector('#streak'),
  progress: document.querySelector('#progress-bar'),
  domain: document.querySelector('#domain'),
  question: document.querySelector('#question-text'),
  answers: document.querySelector('#answers'),
  feedback: document.querySelector('#feedback'),
  next: document.querySelector('#next-button'),
  restart: document.querySelector('#restart-button'),
  results: document.querySelector('#results'),
  resultsCopy: document.querySelector('#results-copy'),
  playAgain: document.querySelector('#play-again-button'),
};

function renderQuestion() {
  const current = questions[state.index];
  state.locked = false;
  els.count.textContent = `${state.index + 1} / ${questions.length}`;
  els.score.textContent = state.score;
  els.streak.textContent = state.streak;
  els.progress.style.width = `${(state.index / questions.length) * 100}%`;
  els.domain.textContent = current.domain;
  els.question.textContent = current.prompt;
  els.answers.innerHTML = '';
  els.feedback.classList.add('hidden');
  els.feedback.textContent = '';
  els.next.disabled = true;
  els.next.textContent = state.index === questions.length - 1 ? 'Show results' : 'Next question';

  current.answers.forEach((answer) => {
    const button = document.createElement('button');
    button.className = 'answer';
    button.type = 'button';
    button.textContent = answer.text;
    button.addEventListener('click', () => chooseAnswer(answer, button));
    els.answers.append(button);
  });
}

function chooseAnswer(answer, selectedButton) {
  if (state.locked) return;
  state.locked = true;
  const isCorrect = answer.type === 'correct';

  if (isCorrect) {
    state.score += 10 + Math.min(state.streak * 2, 10);
    state.streak += 1;
  } else {
    state.streak = 0;
  }

  [...els.answers.children].forEach((button) => {
    const matchingAnswer = questions[state.index].answers.find((item) => item.text === button.textContent);
    button.disabled = true;
    if (matchingAnswer.type === 'correct') button.classList.add('correct');
    if (button === selectedButton && !isCorrect) button.classList.add('incorrect');
    if (button === selectedButton && matchingAnswer.type === 'close') button.classList.add('close');
  });

  els.score.textContent = state.score;
  els.streak.textContent = state.streak;
  els.feedback.innerHTML = `<strong>${isCorrect ? 'Correct.' : 'Not the best answer.'}</strong> ${questions[state.index].explanation}`;
  els.feedback.classList.remove('hidden');
  els.next.disabled = false;
}

function showResults() {
  els.progress.style.width = '100%';
  els.resultsCopy.textContent = `You scored ${state.score} points. Keep practicing the CISSP mindset: choose the answer that best supports risk management, governance, and business objectives.`;
  els.results.classList.remove('hidden');
  els.results.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function restartGame() {
  state.index = 0;
  state.score = 0;
  state.streak = 0;
  els.results.classList.add('hidden');
  renderQuestion();
}

els.next.addEventListener('click', () => {
  if (state.index < questions.length - 1) {
    state.index += 1;
    renderQuestion();
  } else {
    showResults();
    els.next.disabled = true;
  }
});
els.restart.addEventListener('click', restartGame);
els.playAgain.addEventListener('click', restartGame);

renderQuestion();
