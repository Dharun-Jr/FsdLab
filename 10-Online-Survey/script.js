// CS1510 - Experiment 10: Online Survey Application JavaScript

const STORAGE_RESPONSES = 'cs1510_survey_responses';

// Question Bank (12 items without emojis)
const QUESTION_BANK = [
  {
    id: 'q1',
    type: 'mcq',
    text: 'How would you rate the clarity of the CS1510 lab manual instructions?',
    options: ['Excellent - Very clear and descriptive', 'Good - Well understood', 'Average - Needed some explanations', 'Poor - Difficult to follow']
  },
  {
    id: 'q2',
    type: 'text',
    text: 'Which web topic in the laboratory did you enjoy developing the most and why?',
    placeholder: 'e.g., I enjoyed JavaScript localStorage and Flexbox layout...'
  },
  {
    id: 'q3',
    type: 'mcq',
    text: 'How satisfied are you with the practical hands-on hours in the lab?',
    options: ['Highly Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied']
  },
  {
    id: 'q4',
    type: 'mcq',
    text: 'Did the practical lab sessions sufficiently prepare you for building client-side web apps?',
    options: ['Strongly Agree', 'Agree', 'Somewhat Agree', 'Disagree']
  },
  {
    id: 'q5',
    type: 'text',
    text: 'What specific improvement would you suggest for the lab infrastructure?',
    placeholder: 'e.g., Provide updated browser versions or faster network...'
  },
  {
    id: 'q6',
    type: 'mcq',
    text: 'How effective was the guidance provided by faculty during the lab experiments?',
    options: ['Always Helpful', 'Mostly Helpful', 'Adequate', 'Needs Improvement']
  },
  {
    id: 'q7',
    type: 'mcq',
    text: 'Which frontend layout paradigm did you find most intuitive during the lab exercises?',
    options: ['CSS3 Flexbox', 'CSS Grid', 'Standard Block Layout', 'Table Layout']
  },
  {
    id: 'q8',
    type: 'text',
    text: 'Describe one key concept you mastered regarding client-side localStorage.',
    placeholder: 'e.g., Serializing objects to strings using JSON.stringify()...'
  },
  {
    id: 'q9',
    type: 'mcq',
    text: 'How frequently did you experience browser compatibility discrepancies during testing?',
    options: ['Never - Worked smoothly', 'Rarely', 'Occasionally', 'Frequently']
  },
  {
    id: 'q10',
    type: 'mcq',
    text: 'Would you recommend this Full Stack Development curriculum to your juniors?',
    options: ['Definitely Yes', 'Probably Yes', 'Not Sure', 'No']
  },
  {
    id: 'q11',
    type: 'text',
    text: 'Share any final feedback regarding your overall lab exam preparation.',
    placeholder: 'e.g., Practicing Vanilla JS without frameworks made core concepts clear.'
  },
  {
    id: 'q12',
    type: 'mcq',
    text: 'How would you rate the pacing of the 10 lab experiments throughout the semester?',
    options: ['Well Balanced', 'Slightly Fast', 'Slightly Slow', 'Too Demanding']
  }
];

let currentActiveQuestions = [];

const surveyView = document.getElementById('surveyView');
const successView = document.getElementById('successView');
const adminView = document.getElementById('adminView');
const toggleAdminBtn = document.getElementById('toggleAdminBtn');
const adminBtnText = document.getElementById('adminBtnText');

const surveyForm = document.getElementById('surveyForm');
const surveyAlert = document.getElementById('surveyAlert');
const studentNameInput = document.getElementById('studentName');
const studentRegInput = document.getElementById('studentReg');
const questionsContainer = document.getElementById('questionsContainer');
const regenerateQuestionsBtn = document.getElementById('regenerateQuestionsBtn');

const responseRefId = document.getElementById('responseRefId');
const retakeSurveyBtn = document.getElementById('retakeSurveyBtn');
const viewInAdminBtn = document.getElementById('viewInAdminBtn');

const backToSurveyBtn = document.getElementById('backToSurveyBtn');
const clearResponsesBtn = document.getElementById('clearResponsesBtn');
const totalSubmissionsCount = document.getElementById('totalSubmissionsCount');
const questionBankSize = document.getElementById('questionBankSize');
const submissionsList = document.getElementById('submissionsList');

function pickRandomQuestions(count = 5) {
  const shuffled = [...QUESTION_BANK];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function renderQuestions() {
  currentActiveQuestions = pickRandomQuestions(5);
  questionsContainer.innerHTML = '';
  surveyAlert.classList.add('hidden');

  currentActiveQuestions.forEach((q, index) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `qCard_${q.id}`;

    const qNum = index + 1;
    let inputHtml = '';

    if (q.type === 'mcq') {
      inputHtml = `
        <div class="options-grid">
          ${q.options.map(opt => `
            <label class="option-label">
              <input type="radio" name="answer_${q.id}" value="${escapeHtml(opt)}" data-qid="${q.id}">
              <span>${escapeHtml(opt)}</span>
            </label>
          `).join('')}
        </div>
      `;
    } else {
      inputHtml = `
        <textarea 
          class="q-textarea" 
          name="answer_${q.id}" 
          data-qid="${q.id}" 
          rows="3" 
          placeholder="${q.placeholder || 'Type your feedback here...'}"
        ></textarea>
      `;
    }

    card.innerHTML = `
      <div class="question-header">
        <span class="q-badge">Question ${qNum} of 5</span>
        <span class="q-type-tag">${q.type === 'mcq' ? 'Multiple Choice' : 'Text Response'}</span>
      </div>
      <div class="q-text">${qNum}. ${escapeHtml(q.text)}</div>
      ${inputHtml}
    `;

    card.addEventListener('input', () => {
      card.classList.remove('highlight-missing');
    });

    questionsContainer.appendChild(card);
  });
}

regenerateQuestionsBtn.addEventListener('click', () => {
  renderQuestions();
});

surveyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  surveyAlert.classList.add('hidden');

  const name = studentNameInput.value.trim();
  const regNo = studentRegInput.value.trim();

  if (!name || !regNo) {
    showAlert('Please fill in your name and registration number.');
    return;
  }

  const collectedAnswers = [];
  const missingQuestionIndices = [];

  currentActiveQuestions.forEach((q, idx) => {
    const card = document.getElementById(`qCard_${q.id}`);
    card.classList.remove('highlight-missing');

    let answerValue = null;

    if (q.type === 'mcq') {
      const selectedRadio = surveyForm.querySelector(`input[name="answer_${q.id}"]:checked`);
      if (selectedRadio) {
        answerValue = selectedRadio.value;
      }
    } else {
      const textInput = surveyForm.querySelector(`textarea[name="answer_${q.id}"]`);
      if (textInput && textInput.value.trim() !== '') {
        answerValue = textInput.value.trim();
      }
    }

    if (!answerValue) {
      missingQuestionIndices.push(idx + 1);
      card.classList.add('highlight-missing');
    } else {
      collectedAnswers.push({
        questionId: q.id,
        questionText: q.text,
        type: q.type,
        answer: answerValue
      });
    }
  });

  if (missingQuestionIndices.length > 0) {
    showAlert(`Please answer Question(s) ${missingQuestionIndices.join(', ')} marked in red.`);
    return;
  }

  const submissionId = `SRV-${Math.floor(10000 + Math.random() * 90000)}`;
  const submissionRecord = {
    submissionId,
    studentName: name,
    regNo: regNo,
    timestamp: new Date().toLocaleString(),
    answers: collectedAnswers
  };

  const existingResponses = getSavedResponses();
  existingResponses.unshift(submissionRecord);
  saveResponses(existingResponses);

  responseRefId.textContent = `#${submissionId}`;
  surveyView.classList.add('hidden');
  adminView.classList.add('hidden');
  successView.classList.remove('hidden');
});

function showAlert(msg) {
  surveyAlert.textContent = msg;
  surveyAlert.className = 'alert error';
  surveyAlert.classList.remove('hidden');
}

retakeSurveyBtn.addEventListener('click', () => {
  surveyForm.reset();
  renderQuestions();
  successView.classList.add('hidden');
  surveyView.classList.remove('hidden');
});

viewInAdminBtn.addEventListener('click', () => {
  switchToAdminView();
});

function getSavedResponses() {
  const saved = localStorage.getItem(STORAGE_RESPONSES);
  if (!saved) {
    const seed = [
      {
        submissionId: 'SRV-88210',
        studentName: 'Alex Mercer',
        regNo: '21CS012',
        timestamp: '11/10/2026, 09:15:20 AM',
        answers: [
          {
            questionId: 'q1',
            questionText: 'How would you rate the clarity of the CS1510 lab manual instructions?',
            type: 'mcq',
            answer: 'Excellent - Very clear and descriptive'
          },
          {
            questionId: 'q4',
            questionText: 'Did the practical lab sessions sufficiently prepare you for building client-side web apps?',
            type: 'mcq',
            answer: 'Strongly Agree'
          },
          {
            questionId: 'q2',
            questionText: 'Which web topic in the laboratory did you enjoy developing the most and why?',
            type: 'text',
            answer: 'I loved working with Vanilla JS event delegation and localStorage.'
          },
          {
            questionId: 'q7',
            questionText: 'Which frontend layout paradigm did you find most intuitive during the lab exercises?',
            type: 'mcq',
            answer: 'CSS3 Flexbox'
          },
          {
            questionId: 'q10',
            questionText: 'Would you recommend this Full Stack Development curriculum to your juniors?',
            type: 'mcq',
            answer: 'Definitely Yes'
          }
        ]
      }
    ];
    localStorage.setItem(STORAGE_RESPONSES, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(saved);
}

function saveResponses(responses) {
  localStorage.setItem(STORAGE_RESPONSES, JSON.stringify(responses));
}

function switchToAdminView() {
  surveyView.classList.add('hidden');
  successView.classList.add('hidden');
  adminView.classList.remove('hidden');
  adminBtnText.textContent = 'Take Survey';
  renderAdminInspection();
}

function switchToSurveyView() {
  adminView.classList.add('hidden');
  successView.classList.add('hidden');
  surveyView.classList.remove('hidden');
  adminBtnText.textContent = 'Admin View';
}

toggleAdminBtn.addEventListener('click', () => {
  if (adminView.classList.contains('hidden')) {
    switchToAdminView();
  } else {
    switchToSurveyView();
  }
});

backToSurveyBtn.addEventListener('click', switchToSurveyView);

function renderAdminInspection() {
  const responses = getSavedResponses();
  totalSubmissionsCount.textContent = responses.length;
  questionBankSize.textContent = QUESTION_BANK.length;
  submissionsList.innerHTML = '';

  if (responses.length === 0) {
    submissionsList.innerHTML = '<p style="text-align:center; color:#888; padding:1.5rem;">No responses recorded.</p>';
    return;
  }

  responses.forEach(resp => {
    const card = document.createElement('div');
    card.className = 'response-record-card';

    card.innerHTML = `
      <div class="response-header">
        <div>
          <strong>#${resp.submissionId}</strong> - 
          <span>${escapeHtml(resp.studentName)}</span> (${escapeHtml(resp.regNo)})
        </div>
        <span>${resp.timestamp}</span>
      </div>
      <div>
        ${resp.answers.map((a, i) => `
          <div class="resp-q-row">
            <span class="resp-q-text">${i + 1}. ${escapeHtml(a.questionText)}</span>
            <span class="resp-ans-text">&rarr; ${escapeHtml(a.answer)}</span>
          </div>
        `).join('')}
      </div>
    `;

    submissionsList.appendChild(card);
  });
}

clearResponsesBtn.addEventListener('click', () => {
  if (confirm('Delete all recorded responses?')) {
    localStorage.removeItem(STORAGE_RESPONSES);
    renderAdminInspection();
  }
});

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

renderQuestions();
getSavedResponses();
