

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
    question: 'Parmi les "métiers" suivants, lequel vous intéresserait le plus ?',
    answers: [{
        title: 'Inventeur',
        value: 0.2
    }, {
        title: 'Hacker',
        value: 0.4
    }, {
        title: 'Astronaute',
        value: 0.6
    }, {
        title: 'Savant fou',
        value: 0.8
    }, {
        title: 'Mathématicien',
        value: 1.0
    }]
},
    {
        question: "De quelle personnalité scientifique vous sentez-vous la plus proche parmi les suivantes ?",
        answers: [{
            title: "Newton",
            value: 0.2
        }, {
            title: "Mendeleïev",
            value: 0.4
        }, {
            title: "Turing",
            value: 0.6
        }, {
            title: "Tesla",
            value: 0.8
        }, {
            title:"Richter",
            value: 1.0
        }]
    },
    {
        question: "Qu’est-ce qui se rapproche le plus de votre personnalité ?",
        answers: [{
            title: 'Curieux/Curieuse',
            value: 0.2
        }, {
            title: "Empathique",
            value: 0.4
        }, {
            title: "Travailleur/Travailleuse",
            value: 0.6
        }, {
            title: "Consciencieux/Consciencieuse",
            value: 0.8
        }, {
            title: "Meneur/Meneuse",
            value: 1.0
        }]
    },
    {
        question: "Qu’est-ce qui se rapproche le plus de votre personnalité ?",
        answers: [{
            title: "Distrait/Distraite",
            value: 0.2
        }, {
            title: "Fainéant/Fainéante",
            value: 0.4
        }, {
            title: "Impatient/Impatiente",
            value: 0.6
        }, {
            title: "Anxieux/Anxieuse",
            value: 0.8
        }, {
            title: "Têtu/Têtue",
            value: 1.0
        }]
    },
    {
        question: "Qu'est ce qui attise le plus votre curiosité ?",
        answers: [{
            title: "Comprendre comment fonctionne une fusée.",
            value: 0.2
        }, {
            title: "Comprendre comment programmer une application.",
            value: 0.4
        }, {
            title: "Comprendre ce qu'il se passe dans une centrale nucléaire.",
            value: 0.6
        }, {
            title: "Comprendre comment fonctionne un moteur.",
            value: 0.8
        }, {
            title: "Comprendre comment fonctionne une carte graphique.",
            value: 1.0
        }]
    },
    {
        question: "Parmi les cours suivants quel était votre cours préféré à l’école ?",
        answers: [{
            title: "Math",
            value: 0.2
        }, {
            title: "Physique",
            value: 0.4
        }, {
            title: "Chimie",
            value: 0.6
        }, {
            title: "Géographie",
            value: 0.8
        }, {
            title: "Informatique",
            value: 1.0
        }]
    },
    {
        question: "Quelle proposition, parmi les suivantes, vous correspond le plus ?",
        answers: [{
            title: "J'aimerais gérer mon équipe d'employés.",
            value: 0.2
        }, {
            title: "J'aimerais voyager un maximum grâce à mon travail.",
            value: 0.4
        }, {
            title: "J'aimerais relever des challenges.",
            value: 0.6
        }, {
            title: "J'aimerais participer à améliorer le futur.",
            value: 0.8
        }, {
            title: "J'aimerais comprendre les lois qui régissent notre monde.",
            value: 1.0
        }]
    }
];

var recordedAnswers = [];


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
        recordedAnswers = [];
    });

    els.answersContainer.addEventListener('click', ({ target }) => {
        if (target.tagName !== 'LI') {
            return;
        }
        const value = target.getAttribute('data-option');
        recordedAnswers.push(value);

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
    const values = [recordedAnswers];
    var mat1 = [[6.311280277031886,3.7654214261873986,0.5416225761038235,2.3505425240011504,1.2191747049682096,-23.119565286382755,-0.13044407391622453,-13.55393088684333],
    [-18.885608625296072,-16.994713667543586,-2.3015163337974633,0.4888671438066166,0.6928170716513139,19.203191638095646,6.321840751357336,-1.33658887688549],
    [2.540415566452628,11.120384801319183,-1.6751399674421854,-7.6596306834183805,-1.0159931475032673,-20.778448850224347,-3.611545767705511,-6.140920268350898],
    [-0.26180669928106937,-8.856840336218248,5.556247153627317,19.736260802352657,-0.5771154207303,-5.400517733112008,-14.136388682553205,0.21425190094452706],
    [-10.819896748266663,5.031203534357983,-9.971643229957799,-9.917047322664335,13.207807047227721,2.3421105153208623,-6.5871756738372245,-1.425940188157217],
    [-12.53797866497308,5.384230580066415,-4.009195922024479,-23.321227649799606,-4.201796279707561,2.491352223031315,5.244152756986995,13.36243973098943],
    [14.27333299291501,2.5659495739681946,-1.9144359889402758,-9.052617735659728,-12.480577889969691,-2.2358651155574196,-5.600574710667506,4.305146650602266]];
    var mat2 = [[4.022096654271457],[-3.746160645660154],[7.963637082485434],[-6.025612369951088],[3.3243120960053774],[-4.068900413573461],[9.254736210531469],[3.2101964504493035]];
    var option ;

    const resultat = sigmoid(multiplyMatrices(sigmoid(multiplyMatrices(values, mat1)),mat2));

    if (resultat < 0.3) {
        option = "Chimie et sciences des matériaux"
    }
    if (resultat >= 0.3 && resultat < 0.5) {
        option = "Electricité"
    }
    if (resultat >= 0.5 && resultat < 0.7) {
        option = "Informatique et gestion"
    }
    if (resultat >= 0.7 && resultat < 0.9) {
        option = "Mécanique"
    }
    if (resultat >= 0.9) {
        option = "Mines et géologie"
    }

    els.endScreen.querySelector('span').textContent = option;
};

const displayQuestion = (index) => {

    const currentQuestion = questions[index];

    const questionEl = els.questionScreen.querySelector('h2');

    const answerEls = currentQuestion.answers.map((answer) => {
        const liEl = document.createElement('li');
        liEl.textContent = answer.title;
        liEl.setAttribute('data-option', answer.value);
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

const multiplyMatrices = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
        throw new Error('arguments should be in 2-dimensional array format');
    }
    let x = a.length,
        z = a[0].length,
        y = b[0].length;
    if (b.length !== z) {
        // XxZ & ZxY => XxY
        throw new Error('number of columns in the first matrix should be the same as the number of rows in the second');
    }
    let productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
    let product = new Array(x);
    for (let p = 0; p < x; p++) {
        product[p] = productRow.slice();
    }
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            for (let k = 0; k < z; k++) {
                product[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return product;
}

const sigmoid = (a) => {
    for (let i=0; i < a.length; i++) {
        for (let j=0; j < a[0].length; j++) {
            a[i][j] = 1/(1+Math.pow(Math.E,-a[i][j]));
        }
    }
    return a;
}