const LOCALES = {
  en: {
    id: 'en',
    lang: 'en',
    dir: 'ltr',
    label: 'English',
  },
  he: {
    id: 'he',
    lang: 'he',
    dir: 'rtl',
    label: 'עברית',
  },
}

const UI_MESSAGES = {
  en: {
    languageLabel: 'Language',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    difficulty: 'Difficulty:',
    levels: {
      level01: 'Level 1',
      level02: 'Level 2',
      level03: 'Level 3',
      level05: 'Level 5',
      level07: 'Level 7',
    },
    emptyState: {
      title: 'Pick a topic to get started',
      description: 'Choose a math topic from the topics list to begin practising.',
    },
    errors: {
      exerciseLoad: 'Could not load this exercise.',
    },
    actions: {
      checkAnswers: 'Check Answers',
      checkAnswersTitle: 'Check your answers',
      giveHint: 'Give Hint',
      giveHintTitle: 'Get a hint',
      howToSolve: 'How to solve?',
      howToSolveTitle: 'Show the full solution',
      next: 'Next',
      nextTitle: 'Go to next exercise',
    },
    answerSectionTitle: 'Your Answer(s)',
    hintTitle: ({ count }) => (count > 1 ? 'Hints' : 'Hint'),
    solutionTitle: 'Step-by-step solution',
    scratchPad: {
      title: 'Scratch Pad',
      description: 'Your personal workspace - jot notes or work out your steps. This will not be checked.',
      placeholder: 'Write out your working, sketch your approach, or jot down notes here...',
    },
    feedback: {
      incorrect: ({ count }) => `Incorrect - ${count} attempt${count === 1 ? '' : 's'} remaining.`,
      correct: 'Correct! Great work!',
      failed: 'No more attempts. Click "How to solve?" to see the solution, or "Next" to continue.',
    },
    auth: {
      title: 'Account',
      loading: 'Checking your sign-in status...',
      notConfigured: 'Cloud sync is not configured yet. Add the Firebase environment variables to enable it.',
      signInHint: 'Sign in with Google to sync your progress across browsers and devices.',
      googleSignIn: 'Sign in with Google',
      signingIn: 'Signing in...',
      signOut: 'Sign out',
      signingOut: 'Signing out...',
      welcomeBack: 'Signed in',
    },
    sync: {
      disabled: 'Cloud sync unavailable',
      loading: 'Loading your cloud progress...',
      saving: 'Saving your progress...',
      ready: ({ time }) => (time ? `Last synced ${time}` : 'Cloud sync is on'),
      'signed-out': 'Saved on this device only',
      error: 'Cloud sync needs attention',
    },
    history: {
      count: ({ count }) => `${count} exercise${count === 1 ? '' : 's'}`,
      exercise: ({ index }) => `Exercise ${index}`,
    },
    mathrixLogoAlt: 'Mathrix logo',
    onboarding: {
      stepLabel: ({ current, total }) => `Step ${current} of ${total}`,
      questionLabel: ({ current, total }) => `Question ${current} of ${total}`,
      common: {
        continue: 'Continue',
        back: 'Back',
        tryAgain: 'Try again',
        cancel: 'Cancel',
      },
      welcome: {
        title: "Let's find your best starting point.",
        description: 'Answer 6 quick questions and Mathrix will build a practice path that fits you.',
        start: 'Start my quick checkup',
        chooseManually: 'I want to choose manually',
      },
      gradeBands: {
        ariaLabel: 'Choose a starting grade band',
        title: 'Choose the path that feels closest.',
        description: 'This is only a starting hint. The checkup will do the fine-tuning.',
        grade6: {
          label: 'Grade 6 Foundations',
          preview: 'Fractions, decimals, percentages',
        },
        grade7: {
          label: 'Grade 7 Bridge',
          preview: 'Multi-step fractions, percentages, early algebra',
        },
        prealgebra: {
          label: 'Pre-Algebra / Early Grade 8',
          preview: 'Variables, patterns, arithmetic progression',
        },
        unsure: {
          label: "I'm not sure",
          preview: 'Let Mathrix start broad and adjust quickly',
        },
      },
      diagnostic: {
        exit: 'Exit diagnostic',
        skipQuestion: 'Skip this question',
        continue: 'Continue',
        keepGoing: 'Mathrix will keep adjusting as you go.',
        loadErrorTitle: 'This checkup question did not load.',
        loadErrorDescription: 'Try again, or skip the checkup and choose topics manually.',
        feedback: {
          correct: 'Nice work. That one landed.',
          incorrect: 'That gives Mathrix a useful signal.',
        },
      },
      confidence: {
        high: 'Strong match',
        medium: 'Good starting point',
        low: "We'll keep adjusting",
      },
      result: {
        readyFor: ({ pathTitle }) => `You're ready for ${pathTitle}`,
        strengths: 'Strongest areas',
        growthAreas: 'Skills to build next',
        startPath: 'Start this path',
        adjustStartingPoint: 'Adjust my starting point',
        seeHowChosen: 'See how this was chosen',
        howChosenSummary: 'This recommendation combines your selected grade band, your answered questions, and where your strongest signals appeared.',
        howChosenGradeBand: ({ gradeBand }) => `Starting hint: ${gradeBand}`,
        howChosenAnswered: ({ count }) => `Questions answered: ${count}`,
        howChosenSkips: ({ count }) => `Questions skipped: ${count}`,
        adjustTitle: 'Adjust your starting point',
        adjustGradeBand: 'Grade band',
        adjustTopic: 'First topic',
        adjustLevel: 'Starting difficulty',
        applyAdjustment: 'Use these changes',
      },
      kickoff: {
        title: ({ pathTitle }) => `${pathTitle} is ready`,
        startingDifficulty: 'Starting difficulty',
        sessionGoalLabel: 'First session goal',
        sessionGoal: 'Start with 3 quick exercises',
        startFirstExercise: 'Start first exercise',
        openOverview: 'Open my path overview',
      },
      setupCard: {
        title: 'Build my personalized path',
        description: 'Take a 2-minute checkup and Mathrix will suggest where to begin next.',
        primary: 'Build my personalized path',
        secondary: 'Keep choosing topics myself',
      },
      sidebar: {
        quickCheckup: 'Quick checkup',
        yourPath: 'Your path',
      },
      home: {
        continuePath: ({ pathTitle }) => `Continue ${pathTitle}`,
        nextRecommendedTopic: ({ topic }) => `Next recommended topic: ${topic}`,
        solvedInPath: ({ count }) => `You solved ${count} exercise${count === 1 ? '' : 's'} in this path`,
        ready: 'Your path is ready when you are.',
        startRecommended: 'Start recommended topic',
        seePath: 'View my path',
      },
      paths: {
        grade6: {
          title: 'Grade 6 Foundations',
          subtitle: 'Concrete arithmetic practice to build speed and confidence.',
        },
        grade7: {
          title: 'Grade 7 Bridge',
          subtitle: 'A bridge from arithmetic fluency into symbolic thinking.',
        },
        prealgebra: {
          title: 'Pre-Algebra Track',
          subtitle: 'Pattern-based and symbolic practice with a stronger push forward.',
        },
      },
    },
  },
  he: {
    languageLabel: 'שפה',
    menu: 'תפריט',
    openMenu: 'פתחו תפריט',
    closeMenu: 'סגרו תפריט',
    difficulty: 'רמה:',
    levels: {
      level01: 'רמה 1',
      level02: 'רמה 2',
      level03: 'רמה 3',
      level05: 'רמה 5',
      level07: 'רמה 7',
    },
    emptyState: {
      title: 'בחרו נושא כדי להתחיל',
      description: 'בחרו נושא מתמטי מרשימת הנושאים כדי להתחיל לתרגל.',
    },
    errors: {
      exerciseLoad: 'לא הצלחנו לטעון את התרגיל הזה.',
    },
    actions: {
      checkAnswers: 'בדקו תשובות',
      checkAnswersTitle: 'בדקו את התשובות שלכם',
      giveHint: 'רמז',
      giveHintTitle: 'קבלו רמז',
      howToSolve: 'איך פותרים?',
      howToSolveTitle: 'הציגו את הפתרון המלא',
      next: 'הבא',
      nextTitle: 'עברו לתרגיל הבא',
    },
    answerSectionTitle: 'התשובות שלכם',
    hintTitle: ({ count }) => (count > 1 ? 'רמזים' : 'רמז'),
    solutionTitle: 'פתרון שלב אחר שלב',
    scratchPad: {
      title: 'טיוטה',
      description: 'מרחב העבודה האישי שלכם - כתבו הערות או שלבי פתרון. התוכן כאן לא נבדק.',
      placeholder: 'כתבו כאן את דרך הפתרון, רעיונות או הערות...',
    },
    feedback: {
      incorrect: ({ count }) => `לא נכון - נותרו עוד ${count} ${count === 1 ? 'ניסיון' : 'ניסיונות'}.`,
      correct: 'נכון! עבודה מצוינת!',
      failed: 'לא נשארו ניסיונות. לחצו על "איך פותרים?" כדי לראות את הפתרון, או על "הבא" כדי להמשיך.',
    },
    auth: {
      title: 'חשבון',
      loading: 'בודקים את מצב ההתחברות שלכם...',
      notConfigured: 'סנכרון הענן עדיין לא מוגדר. הוסיפו את משתני הסביבה של Firebase כדי להפעיל אותו.',
      signInHint: 'התחברו עם Google כדי לסנכרן את ההתקדמות שלכם בין דפדפנים ומכשירים.',
      googleSignIn: 'התחברות עם Google',
      signingIn: 'מתחברים...',
      signOut: 'התנתקות',
      signingOut: 'מתנתקים...',
      welcomeBack: 'מחוברים',
    },
    sync: {
      disabled: 'סנכרון הענן לא זמין',
      loading: 'טוענים את ההתקדמות שלכם מהענן...',
      saving: 'שומרים את ההתקדמות שלכם...',
      ready: ({ time }) => (time ? `הסנכרון האחרון היה ב־${time}` : 'סנכרון הענן פעיל'),
      'signed-out': 'השמירה היא רק על המכשיר הזה',
      error: 'סנכרון הענן דורש טיפול',
    },
    history: {
      count: ({ count }) => `${count} ${count === 1 ? 'תרגיל' : 'תרגילים'}`,
      exercise: ({ index }) => `תרגיל ${index}`,
    },
    mathrixLogoAlt: 'הלוגו של Mathrix',
    onboarding: {
      stepLabel: ({ current, total }) => `שלב ${current} מתוך ${total}`,
      questionLabel: ({ current, total }) => `שאלה ${current} מתוך ${total}`,
      common: {
        continue: 'המשיכו',
        back: 'חזרה',
        tryAgain: 'נסו שוב',
        cancel: 'ביטול',
      },
      welcome: {
        title: 'בואו נמצא את נקודת ההתחלה שמתאימה לכם.',
        description: 'ענו על 6 שאלות קצרות ו-Mathrix יבנה לכם מסלול תרגול שמתאים לכם.',
        start: 'התחילו את הבדיקה הקצרה שלי',
        chooseManually: 'אני רוצה לבחור ידנית',
      },
      gradeBands: {
        ariaLabel: 'בחרו שכבת כיתה התחלתית',
        title: 'בחרו את המסלול שהכי מרגיש קרוב.',
        description: 'זו רק נקודת פתיחה. הבדיקה הקצרה תדייק את זה.',
        grade6: {
          label: 'יסודות כיתה ו׳',
          preview: 'שברים, מספרים עשרוניים, אחוזים',
        },
        grade7: {
          label: 'גשר לכיתה ז׳',
          preview: 'שברים רב-שלביים, אחוזים, אלגברה התחלתית',
        },
        prealgebra: {
          label: 'קדם-אלגברה / תחילת כיתה ח׳',
          preview: 'משתנים, תבניות, סדרה חשבונית',
        },
        unsure: {
          label: 'אני לא בטוח/ה',
          preview: 'Mathrix יתחיל רחב וידייק מהר',
        },
      },
      diagnostic: {
        exit: 'צאו מהבדיקה',
        skipQuestion: 'דלגו על השאלה',
        continue: 'המשיכו',
        keepGoing: 'Mathrix ימשיך להתאים את עצמו תוך כדי.',
        loadErrorTitle: 'לא הצלחנו לטעון את שאלת הבדיקה הזאת.',
        loadErrorDescription: 'אפשר לנסות שוב, או לדלג על הבדיקה ולבחור נושאים ידנית.',
        feedback: {
          correct: 'יפה מאוד. זה עוזר לנו למקם אתכם.',
          incorrect: 'גם זו אינדיקציה טובה בשביל Mathrix.',
        },
      },
      confidence: {
        high: 'התאמה חזקה',
        medium: 'נקודת פתיחה טובה',
        low: 'נמשיך להתאים בהמשך',
      },
      result: {
        readyFor: ({ pathTitle }) => `אתם מוכנים ל-${pathTitle}`,
        strengths: 'התחומים החזקים שלכם',
        growthAreas: 'מיומנויות שכדאי לבנות עכשיו',
        startPath: 'התחילו את המסלול הזה',
        adjustStartingPoint: 'התאימו את נקודת ההתחלה שלי',
        seeHowChosen: 'ראו איך זה נבחר',
        howChosenSummary: 'ההמלצה משלבת את שכבת הכיתה שבחרתם, את השאלות שעניתם עליהן, ואת התחומים שבהם התקבלו האיתותים החזקים ביותר.',
        howChosenGradeBand: ({ gradeBand }) => `רמז הפתיחה: ${gradeBand}`,
        howChosenAnswered: ({ count }) => `שאלות שנענו: ${count}`,
        howChosenSkips: ({ count }) => `שאלות שדולגו: ${count}`,
        adjustTitle: 'התאימו את נקודת ההתחלה שלכם',
        adjustGradeBand: 'שכבת כיתה',
        adjustTopic: 'נושא ראשון',
        adjustLevel: 'רמת התחלה',
        applyAdjustment: 'השתמשו בשינויים האלה',
      },
      kickoff: {
        title: ({ pathTitle }) => `${pathTitle} מוכן`,
        startingDifficulty: 'רמת התחלה',
        sessionGoalLabel: 'יעד למפגש הראשון',
        sessionGoal: 'התחילו עם 3 תרגילים קצרים',
        startFirstExercise: 'התחילו את התרגיל הראשון',
        openOverview: 'פתחו את סקירת המסלול שלי',
      },
      setupCard: {
        title: 'בנו לי מסלול אישי',
        description: 'עברו בדיקה של כשתי דקות ו-Mathrix יציע מאיפה להתחיל.',
        primary: 'בנו לי מסלול אישי',
        secondary: 'להמשיך לבחור נושאים לבד',
      },
      sidebar: {
        quickCheckup: 'בדיקה קצרה',
        yourPath: 'המסלול שלכם',
      },
      home: {
        continuePath: ({ pathTitle }) => `המשיכו ב-${pathTitle}`,
        nextRecommendedTopic: ({ topic }) => `הנושא המומלץ הבא: ${topic}`,
        solvedInPath: ({ count }) => `פתרתם ${count} ${count === 1 ? 'תרגיל' : 'תרגילים'} במסלול הזה`,
        ready: 'המסלול שלכם מוכן כשתרצו.',
        startRecommended: 'התחילו את הנושא המומלץ',
        seePath: 'הציגו את המסלול שלי',
      },
      paths: {
        grade6: {
          title: 'יסודות כיתה ו׳',
          subtitle: 'תרגול חשבוני מוחשי לבניית מהירות וביטחון.',
        },
        grade7: {
          title: 'גשר לכיתה ז׳',
          subtitle: 'גשר משטף חשבוני אל חשיבה סמלית.',
        },
        prealgebra: {
          title: 'מסלול קדם-אלגברה',
          subtitle: 'תרגול מבוסס תבניות וסמלים עם דחיפה מעט חזקה יותר קדימה.',
        },
      },
    },
  },
}

function getMessage(messages, key) {
  return key.split('.').reduce((value, part) => value?.[part], messages)
}

function resolveInputTranslations(overlayInputs) {
  if (!Array.isArray(overlayInputs)) return new Map()

  return new Map(
    overlayInputs
      .filter(input => input?.name)
      .map(input => [input.name, input])
  )
}

export function getLocale(language = 'en') {
  return LOCALES[language] || LOCALES.en
}

export function getSupportedLocales() {
  return Object.values(LOCALES)
}

export function translate(language, key, params = {}) {
  const localeMessages = UI_MESSAGES[language] || UI_MESSAGES.en
  const fallbackMessage = getMessage(UI_MESSAGES.en, key)
  const message = getMessage(localeMessages, key) ?? fallbackMessage ?? key

  if (typeof message === 'function') {
    return message(params)
  }

  return message
}

export function localizeTopic(topic, language = 'en') {
  const overlay = topic?.translations?.[language]

  if (!overlay?.name) {
    return topic
  }

  return {
    ...topic,
    name: overlay.name,
  }
}

export function localizeTopics(topics = [], language = 'en') {
  return topics.map(topic => localizeTopic(topic, language))
}

export function localizeExercise(exercise, language = 'en') {
  const overlay = exercise?.translations?.[language]

  if (!overlay) {
    return exercise
  }

  const localizedInputs = resolveInputTranslations(overlay.inputs)

  return {
    ...exercise,
    topicName: overlay.topicName ?? exercise.topicName,
    instructions: overlay.instructions ?? exercise.instructions,
    question: {
      ...exercise.question,
      text: overlay.question?.text ?? exercise.question?.text,
    },
    inputs: (exercise.inputs || []).map(input => {
      const inputOverlay = localizedInputs.get(input.name)
      if (!inputOverlay) return input

      return {
        ...input,
        label: inputOverlay.label ?? input.label,
      }
    }),
    hints: overlay.hints ?? exercise.hints,
    explanation: {
      ...exercise.explanation,
      steps: overlay.explanation?.steps ?? exercise.explanation?.steps,
    },
  }
}