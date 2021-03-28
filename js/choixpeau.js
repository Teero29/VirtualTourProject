// DOM => Document Object Model

const els = {
    welcomeScreen: null,
    questionScreen: null,
    endScreen: null,
    welcomeBtn: null,
    answers: null,
    endBtn: null,
    answersContainer: null
};

let questionIndex = 0;

const questions = [{
    question: "Quel est ton cours préféré à l'école  ?",
    answers: [{
        title: 'Math',
        option: 'Elec'
    }, {
        title: 'Physique',
        option: 'Mécanique'
    }, {
        title: 'Français',
        option: 'None'
    }, {
        title: 'Bio',
        option: 'None'
    }, {
        title: 'Chimie',
        option: 'Chimie'
    }]
},
    {
        question: "Quelle proposition, parmis les suivantes, te correspond le plus ?",
        answers: [{
            title: "J'aimerais gérer mon équipe d'employé",
            option: 'Info'
        }, {
            title: "J'aimerais voyager un maximum grâce à mon travail",
            option: 'Mine'
        }, {
            title: "Je n'aime pas les responsabilités",
            option: 'None'
        }, {
            title: "J'aimerais participer à améliorer le futur",
            option: 'Archi'
        }, {
            title:"J'aimerais comprendre les lois qui régissent notre monde",
            option:'Mécanique'
        }]
    },
    {
        question: "Qu'est ce qui attise le plus ta curiosité ?",
        answers: [{
            title: 'Comprendre comment construire les maisons les plus efficaces.',
            option: 'Archi'
        }, {
            title: "Comprendre comment programmer un site comme celui-ci.",
            option: 'Info'
        }, {
            title: "Comprendre ce qu'il se passe comme phénomène pendant une réacion chimique.",
            option: 'Chimie'
        }, {
            title: "Comprendre coment fonctionne un moteur",
            option: 'Mécanique'
        }, {
            title: "Comprendre comment fonctionne les petits circuits éléctriques.",
            option: 'Elec'
        }]
    },
    {
        question: "Qu'est-ce-qui t'intérèsse le plus",
        answers: [{
            title: "L'économie",
            option: 'Info'
        }, {
            title: "L'habitat",
            option: 'Archi'
        }, {
            title: "La physique des particules",
            option: 'Chimie'
        }, {
            title: "La géologie",
            option: 'Mine'
        }, {
            title: "L'éléctricité",
            option: 'Elec'
        }]
    }
];

const recordedAnswers = [];


const init = () => {
    console.log('Page has loaded');

    els.welcomeScreen = document.querySelector('.welcome-screen');
    els.questionScreen = document.querySelector('.question-screen');
    els.endScreen = document.querySelector('.end-screen');
    els.welcomeBtn = els.welcomeScreen.querySelector('button');
    els.endBtn = els.endScreen.querySelector('button');
    els.answersContainer = els.questionScreen.querySelector('ul');

    els.welcomeBtn.addEventListener('click', () => {
        displayScreen('question');
        displayQuestion(questionIndex);
    });
    els.endBtn.addEventListener('click', () => {
        displayScreen('welcome');
        questionIndex = 0;
    });

    els.answersContainer.addEventListener('click', ({ target }) => {
        if (target.tagName !== 'LI') {
            return;
        }
        const option = target.getAttribute('data-option');
        recordedAnswers.push(option);

        questionIndex++;

        if (questionIndex >= questions.length) {
            calculateScore();
            displayScreen('end');
        } else {
            displayQuestion(questionIndex);
        }
    });

};

const calculateScore = () => {
    const option = recordedAnswers.sort((a, b) => {
        return recordedAnswers.filter(answer => answer === a).length -
            recordedAnswers.filter(answer => answer === b).length
    }).pop();
    // console.log('house', house);

    const options = {
        Elec: 'Ingénieur civil Electricien',
        Mécanique: 'Ingénieur civil Mécanicien',
        Chimie: 'Ingénieur civil en chimie et science des matériaux',
        Info: 'Ingénieur civil en Informatique et Gestion',
        Mine: 'Ingénieur civil des Mines et Géologue',
        Archi: "Ingénieur civil Architecte",
        None: 'Aucun'
    };

    els.endScreen.querySelector('span').textContent = options[option];
};

const displayQuestion = (index) => {

    const currentQuestion = questions[index];

    const questionEl = els.questionScreen.querySelector('h2');

    const answerEls = currentQuestion.answers.map((answer) => {
        const liEl = document.createElement('li');
        liEl.textContent = answer.title;
        liEl.setAttribute('data-option', answer.option);
        return liEl;
    });

    questionEl.textContent = currentQuestion.question;
    els.answersContainer.textContent = '';
    els.answersContainer.append(...answerEls);
};

const displayScreen = (screenName) => {
    // console.log('screenName', screenName);
    els.welcomeScreen.style.display = 'none';
    els.questionScreen.style.display = 'none';
    els.endScreen.style.display = 'none';

    const screen = els[screenName + 'Screen'];
    // console.log('screen', screen);
    screen.style.display = 'flex';
};


window.addEventListener('load', init);