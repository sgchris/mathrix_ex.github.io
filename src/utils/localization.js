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
    recommendations: {
      title: 'Recommended next',
      homeEyebrow: 'Guided practice',
      homeTitle: 'Ready for your next step?',
      homeDescription: 'Mathrix can keep you moving with one clear next step and two nearby alternatives.',
      manualNote: 'You can still browse topics manually or open the mastery map any time.',
      alternativesTitle: 'Two more options',
      alternativesHint: 'If the main suggestion feels too easy or too hard, pick a nearby alternative.',
      whyTitle: 'Why this?',
      types: {
        continue: 'Continue',
        level_up: 'Level Up',
        recovery: 'Recovery',
        bridge: 'Try Next Topic',
        review: 'Quick Review',
      },
      titles: {
        continue: ({ topic }) => `Continue with ${topic}`,
        level_up: ({ topic }) => `Move up in ${topic}`,
        recovery: ({ topic }) => `Rebuild ${topic} step by step`,
        bridge: ({ topic }) => `Try ${topic} next`,
        review: ({ topic }) => `Refresh ${topic}`,
      },
      reasons: {
        recentStruggle: ({ topic }) => `${topic} looks shaky right now, so Mathrix recommends an easier warm-up.`,
        heavySupport: ({ topic }) => `You needed a lot of support in ${topic}, so a lighter review should help first.`,
        cleanStreak: ({ count, topic }) => `You solved ${count} ${topic} exercise${count === 1 ? '' : 's'} cleanly.`,
        sameTopicMomentum: ({ topic }) => `You were doing well in ${topic}, so one more should keep the momentum going.`,
        bridgeReady: ({ fromTopic, topic }) => `Your recent work in ${fromTopic} suggests you are ready to connect it to ${topic}.`,
        needsReview: ({ skill }) => `${skill} needs a quick review before you push ahead.`,
        coldTopic: ({ topic, days }) => `You have not practised ${topic} for ${days} day${days === 1 ? '' : 's'}, so a short refresh makes sense.`,
        pathSuggestion: 'This matches the next step in your current learning path.',
        masterySuggestion: 'This lines up with the next skill your mastery map is pointing to.',
      },
      actions: {
        keepGoing: 'Keep going',
        moveUp: 'Move to the next level',
        tryWarmup: 'Try an easier warm-up',
        tryNextTopic: 'Try the next topic',
        startReview: 'Start quick review',
        whyThis: 'Why this?',
        seeOnMap: 'See on map',
        dismiss: 'Dismiss',
        gotIt: 'Got it',
        closeWhy: 'Close recommendation details',
        openMap: 'Open mastery map',
        nextContinueTitle: 'Continue with the recommended next exercise',
        nextLevelUpTitle: 'Move to the recommended higher level exercise',
        nextRecoveryTitle: 'Start the recommended recovery exercise',
        nextBridgeTitle: 'Start the recommended next-topic exercise',
        nextReviewTitle: 'Start the recommended review exercise',
      },
      effort: {
        short: '2 to 3 min',
        medium: '3 to 4 min',
      },
      fit: {
        high: 'Best next step',
        medium: 'Good fit',
        low: 'Suggested next',
      },
      strip: {
        upNext: 'Up next',
        recovery: 'Let’s make the next one more manageable',
        levelUp: 'You are ready to stretch a bit',
        bridge: 'A good moment to connect skills',
      },
      explanation: {
        title: 'Why Mathrix picked this',
        whyHeading: 'Why this was selected',
        skillHeading: 'What it helps with',
        alternativeHeading: 'If it feels wrong',
        skill: ({ skill }) => `This helps strengthen ${skill}.`,
        topic: ({ topic }) => `This keeps your practice moving inside ${topic}.`,
        alternative: ({ topic }) => `If this feels off, try ${topic} instead.`,
        manual: 'If none of these feel right, you can switch topics or levels manually.',
      },
    },
    mastery: {
      eyebrow: 'Learning Journey',
      title: 'Your Mastery Map',
      bandLabel: 'Grade band',
      topicRecommended: 'Recommended path',
      gradeBands: {
        grade6Subtitle: 'Core arithmetic ideas that build confidence first.',
        grade7Subtitle: 'Bridge skills that start to connect numbers and symbols.',
        prealgebraSubtitle: 'More symbolic practice with patterns, rules, and review points.',
      },
      summary: {
        coverage: 'Stable skills',
        progress: ({ stable, total }) => `${stable} of ${total} skills feel stable`,
        reviewChip: ({ count }) => `${count} need review`,
        fromEvidence: ({ strongTopic, growthTopic }) => `You are strongest in ${strongTopic} and building confidence in ${growthTopic}.`,
        fromProfile: ({ strongTopic, growthTopic }) => `Your path starts with ${strongTopic} while ${growthTopic} is the next area to build.`,
        generic: 'As you solve exercises, this map will show what feels solid and what should come next.',
      },
      recency: {
        none: 'No recent practice yet',
        today: 'Practised today',
        yesterday: 'Practised yesterday',
        daysAgo: ({ count }) => `Practised ${count} days ago`,
        older: 'Practised over a week ago',
      },
      actions: {
        practiceRecommended: 'Practice recommended skill',
        seeAllTopics: 'See all topics',
        backToPractice: 'Back to practice',
        closeDetails: 'Close details',
        practiceNow: 'Practice now',
        reviewPrevious: 'Review easier skill',
        openSkillMap: 'See this skill on the map',
      },
      views: {
        map: 'Map view',
        list: 'List view',
      },
      filters: {
        ariaLabel: 'Mastery map filters',
        gradeBand: 'Grade band',
        allGradeBands: 'All grade bands',
        topic: 'Topic',
        allTopics: 'All topics',
        state: 'Mastery state',
        allStates: 'All states',
        sort: 'Sort',
      },
      sort: {
        recommended: 'Recommended first',
        weakest: 'Weakest first',
        recent: 'Recently practised',
        nearMastery: 'Near mastery',
      },
      states: {
        not_started: 'Not started',
        practicing: 'Practicing',
        almost_mastered: 'Almost mastered',
        mastered: 'Mastered',
        needs_review: 'Needs review',
      },
      topicSummary: ({ stable, total }) => `${stable} of ${total} skills stable`,
      empty: {
        title: 'No skills match these filters yet',
        description: 'Try a wider view, or keep practising so more of the map lights up.',
        clearFilters: 'Clear filters',
      },
      outcomes: {
        solved: 'Solved',
        failed: 'Missed',
        explained: 'Used solution',
        in_progress: 'In progress',
      },
      detail: {
        emptyTitle: 'Choose a skill',
        emptyDescription: 'Open any node to see what it means and what to practise next.',
        recentActivity: 'Recent activity',
        noRecentActivity: 'Solve one exercise here and your recent activity will appear.',
        metrics: {
          accuracy: 'Accuracy trend',
          hints: 'Hint reliance',
          recency: 'Recent practice',
        },
        explanations: {
          mastered: 'You usually solve this skill correctly and with little support.',
          almost_mastered: 'You are close here. One more strong practice round should confirm it.',
          needs_review: 'Recent results suggest this skill needs a quick refresh before you push ahead.',
          practicing: 'You can do parts of this skill, but mistakes are still common.',
          not_started: 'This skill is still waiting for its first solved exercise.',
        },
        progress: {
          none: 'No data yet',
          low: 'Low',
          medium: 'Medium',
          high: 'High',
          strong: 'Strong',
          steady: 'Steady',
          building: 'Building',
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
    recommendations: {
      title: 'מומלץ עכשיו',
      homeEyebrow: 'תרגול מונחה',
      homeTitle: 'מוכנים לצעד הבא שלכם?',
      homeDescription: 'Mathrix יכול להמשיך איתכם עם צעד ברור אחד ועוד שתי חלופות קרובות.',
      manualNote: 'תמיד אפשר גם לעיין בנושאים ידנית או לפתוח את מפת השליטה.',
      alternativesTitle: 'עוד שתי אפשרויות',
      alternativesHint: 'אם ההצעה הראשית מרגישה קלה מדי או קשה מדי, בחרו חלופה קרובה.',
      whyTitle: 'למה דווקא זה?',
      types: {
        continue: 'להמשיך',
        level_up: 'לעלות רמה',
        recovery: 'חזרה מדורגת',
        bridge: 'לנסות נושא הבא',
        review: 'ריענון קצר',
      },
      titles: {
        continue: ({ topic }) => `המשיכו עם ${topic}`,
        level_up: ({ topic }) => `עלו רמה ב-${topic}`,
        recovery: ({ topic }) => `נבנה מחדש את ${topic} שלב אחר שלב`,
        bridge: ({ topic }) => `נסו עכשיו את ${topic}`,
        review: ({ topic }) => `רעננו את ${topic}`,
      },
      reasons: {
        recentStruggle: ({ topic }) => `נראה ש-${topic} קצת מתנדנד כרגע, לכן Mathrix ממליץ על חימום קל יותר.`,
        heavySupport: ({ topic }) => `נדרשה כאן הרבה עזרה ב-${topic}, ולכן ריענון קל יעזור לפני שממשיכים.`,
        cleanStreak: ({ count, topic }) => `פתרתם ${count} ${count === 1 ? 'תרגיל' : 'תרגילים'} ב-${topic} בצורה נקייה.`,
        sameTopicMomentum: ({ topic }) => `הלך לכם טוב ב-${topic}, ולכן עוד תרגיל אחד יכול לשמור על המומנטום.`,
        bridgeReady: ({ fromTopic, topic }) => `העבודה האחרונה שלכם ב-${fromTopic} מרמזת שאתם מוכנים לחבר את זה אל ${topic}.`,
        needsReview: ({ skill }) => `כדאי לרענן קצת את ${skill} לפני שממשיכים קדימה.`,
        coldTopic: ({ topic, days }) => `לא תרגלתם את ${topic} כבר ${days} ${days === 1 ? 'יום' : 'ימים'}, ולכן ריענון קצר מתאים עכשיו.`,
        pathSuggestion: 'זה תואם לצעד הבא במסלול הלמידה הנוכחי שלכם.',
        masterySuggestion: 'זה תואם למיומנות הבאה שמפת השליטה שלכם מצביעה עליה.',
      },
      actions: {
        keepGoing: 'להמשיך',
        moveUp: 'לעבור לרמה הבאה',
        tryWarmup: 'לנסות חימום קל יותר',
        tryNextTopic: 'לנסות את הנושא הבא',
        startReview: 'להתחיל ריענון קצר',
        whyThis: 'למה זה?',
        seeOnMap: 'לראות על המפה',
        dismiss: 'להסתיר',
        gotIt: 'הבנתי',
        closeWhy: 'סגירת פירוט ההמלצה',
        openMap: 'פתיחת מפת השליטה',
        nextContinueTitle: 'להמשיך עם התרגיל המומלץ הבא',
        nextLevelUpTitle: 'לעבור לתרגיל המומלץ ברמה גבוהה יותר',
        nextRecoveryTitle: 'להתחיל את תרגיל החזרה המומלץ',
        nextBridgeTitle: 'להתחיל את התרגיל המומלץ בנושא הבא',
        nextReviewTitle: 'להתחיל את תרגיל הריענון המומלץ',
      },
      effort: {
        short: '2 עד 3 דק׳',
        medium: '3 עד 4 דק׳',
      },
      fit: {
        high: 'הצעד הכי מתאים עכשיו',
        medium: 'מתאים לכם עכשיו',
        low: 'הצעה להמשך',
      },
      strip: {
        upNext: 'מה הלאה',
        recovery: 'בואו נהפוך את הבא לקצת יותר פשוט',
        levelUp: 'נראה שאתם מוכנים להימתח קצת',
        bridge: 'זה רגע טוב לחבר בין מיומנויות',
      },
      explanation: {
        title: 'למה Mathrix בחר בזה',
        whyHeading: 'למה זה נבחר',
        skillHeading: 'במה זה עוזר',
        alternativeHeading: 'אם זה לא מרגיש נכון',
        skill: ({ skill }) => `זה יעזור לחזק את ${skill}.`,
        topic: ({ topic }) => `זה שומר את התרגול שלכם בתנועה בתוך ${topic}.`,
        alternative: ({ topic }) => `אם זה לא מרגיש נכון, אפשר לנסות במקום זה את ${topic}.`,
        manual: 'אם שום אפשרות כאן לא מתאימה, אפשר להחליף נושא או רמה ידנית.',
      },
    },
    mastery: {
      eyebrow: 'מסע הלמידה',
      title: 'מפת השליטה שלכם',
      bandLabel: 'שכבת כיתה',
      topicRecommended: 'מסלול מומלץ',
      gradeBands: {
        grade6Subtitle: 'רעיונות חשבוניים בסיסיים שבונים ביטחון קודם.',
        grade7Subtitle: 'מיומנויות גשר שמתחילות לחבר בין מספרים לסמלים.',
        prealgebraSubtitle: 'תרגול סמלי יותר עם תבניות, חוקים ונקודות לחזרה.',
      },
      summary: {
        coverage: 'מיומנויות יציבות',
        progress: ({ stable, total }) => `${stable} מתוך ${total} מיומנויות מרגישות יציבות`,
        reviewChip: ({ count }) => `${count} דורשות חזרה`,
        fromEvidence: ({ strongTopic, growthTopic }) => `אתם חזקים במיוחד ב-${strongTopic} ובונים ביטחון ב-${growthTopic}.`,
        fromProfile: ({ strongTopic, growthTopic }) => `המסלול שלכם מתחיל ב-${strongTopic}, ו-${growthTopic} הוא התחום הבא שכדאי לבנות.`,
        generic: 'ככל שתפתרו יותר תרגילים, המפה תראה מה כבר יציב ומה כדאי לעשות עכשיו.',
      },
      recency: {
        none: 'עדיין אין תרגול עדכני',
        today: 'תורגל היום',
        yesterday: 'תורגל אתמול',
        daysAgo: ({ count }) => `תורגל לפני ${count} ימים`,
        older: 'תורגל לפני יותר משבוע',
      },
      actions: {
        practiceRecommended: 'תרגלו את המיומנות המומלצת',
        seeAllTopics: 'הציגו את כל הנושאים',
        backToPractice: 'חזרה לתרגול',
        closeDetails: 'סגירת פירוט',
        practiceNow: 'תרגלו עכשיו',
        reviewPrevious: 'חזרו למיומנות קלה יותר',
        openSkillMap: 'הציגו את המיומנות הזאת על המפה',
      },
      views: {
        map: 'תצוגת מפה',
        list: 'תצוגת רשימה',
      },
      filters: {
        ariaLabel: 'מסנני מפת השליטה',
        gradeBand: 'שכבת כיתה',
        allGradeBands: 'כל שכבות הכיתה',
        topic: 'נושא',
        allTopics: 'כל הנושאים',
        state: 'מצב שליטה',
        allStates: 'כל המצבים',
        sort: 'מיון',
      },
      sort: {
        recommended: 'קודם ההמלצה',
        weakest: 'מהחלש לחזק',
        recent: 'תורגל לאחרונה',
        nearMastery: 'קרוב לשליטה',
      },
      states: {
        not_started: 'עוד לא התחיל',
        practicing: 'בתרגול',
        almost_mastered: 'כמעט נשלט',
        mastered: 'נשלט',
        needs_review: 'דורש חזרה',
      },
      topicSummary: ({ stable, total }) => `${stable} מתוך ${total} מיומנויות יציבות`,
      empty: {
        title: 'עדיין אין מיומנויות שמתאימות למסננים האלה',
        description: 'נסו תצוגה רחבה יותר, או המשיכו לתרגל כדי שעוד חלקים במפה יידלקו.',
        clearFilters: 'ניקוי מסננים',
      },
      outcomes: {
        solved: 'נפתר',
        failed: 'לא הצליח',
        explained: 'נעשה שימוש בפתרון',
        in_progress: 'בתהליך',
      },
      detail: {
        emptyTitle: 'בחרו מיומנות',
        emptyDescription: 'פתחו כל צומת כדי להבין מה הוא אומר ומה כדאי לתרגל עכשיו.',
        recentActivity: 'פעילות אחרונה',
        noRecentActivity: 'פתרו כאן תרגיל אחד והפעילות האחרונה תופיע.',
        metrics: {
          accuracy: 'מגמת דיוק',
          hints: 'שימוש ברמזים',
          recency: 'תרגול אחרון',
        },
        explanations: {
          mastered: 'בדרך כלל אתם פותרים את המיומנות הזאת נכון ועם מעט מאוד עזרה.',
          almost_mastered: 'אתם קרובים כאן. סבב תרגול חזק נוסף יאשר את זה.',
          needs_review: 'התוצאות האחרונות מרמזות שכדאי לרענן את המיומנות הזאת לפני שממשיכים.',
          practicing: 'אתם כבר יודעים חלק מהמיומנות הזאת, אבל טעויות עדיין קורות לעיתים קרובות.',
          not_started: 'המיומנות הזאת עדיין מחכה לתרגיל הראשון שייפתר.',
        },
        progress: {
          none: 'עדיין אין נתונים',
          low: 'נמוך',
          medium: 'בינוני',
          high: 'גבוה',
          strong: 'חזק',
          steady: 'יציב',
          building: 'בבנייה',
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