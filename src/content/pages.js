// Calculator page content in English and Arabic.
// Each page: slug (URL path), calc (id in calculators.js), group, title, metaTitle, description,
// card (home page text), keywords (search), intro, how (bullets), guide (sections), faq, law, related.
const L = (en, ar) => ({ en, ar });

export const PAGES = [
  {
    slug: 'uae/gratuity-calculator/',
    calc: 'uae-gratuity',
    group: 'uae-eos',
    title: L('UAE Gratuity Calculator', 'حاسبة مكافأة نهاية الخدمة في الإمارات'),
    metaTitle: L('UAE Gratuity Calculator 2026 – End of Service (New Labour Law)', 'حاسبة مكافأة نهاية الخدمة في الإمارات 2026 – قانون العمل الجديد'),
    description: L(
      'Calculate your UAE end-of-service gratuity under the 2022 Labour Law: 21 days of basic salary per year for 5 years, 30 days after. Free, private and shows the working.',
      'احسب مكافأة نهاية الخدمة في الإمارات وفق قانون العمل لعام 2022: أجر 21 يومًا عن كل سنة لأول 5 سنوات، و30 يومًا بعدها. مجانية وتعرض طريقة الحساب.',
    ),
    card: L('21 or 30 days of basic pay per year, capped at 2 years\' wage.', 'أجر 21 أو 30 يومًا عن كل سنة، بحد أقصى أجر سنتين.'),
    keywords: L('gratuity end of service eos private mainland mohre', 'مكافأة نهاية الخدمة القطاع الخاص'),
    intro: L(
      'Private-sector employees in the UAE who complete at least one year of service are owed an end-of-service gratuity. Enter your basic salary and dates to see the amount and how it was worked out.',
      'يستحق العاملون في القطاع الخاص بالإمارات مكافأة نهاية الخدمة بعد إتمام سنة خدمة على الأقل. أدخل راتبك الأساسي والتواريخ لترى المبلغ وطريقة حسابه.',
    ),
    how: [
      L('Daily wage = basic salary ÷ 30', 'الأجر اليومي = الراتب الأساسي ÷ 30'),
      L('Years 1 to 5: 21 days\' wage for each year', 'من السنة 1 إلى 5: أجر 21 يومًا عن كل سنة'),
      L('After 5 years: 30 days\' wage for each year', 'بعد 5 سنوات: أجر 30 يومًا عن كل سنة'),
      L('Part years count in proportion', 'تُحتسب أجزاء السنة بنسبتها'),
      L('Unpaid leave is not counted', 'لا تُحتسب الإجازة غير المدفوعة'),
      L('Total cannot exceed 2 years\' wage', 'لا يتجاوز الإجمالي أجر سنتين'),
      L('Optional: add unused leave days, paid on basic', 'اختياري: أضف أيام الإجازة غير المستخدمة، وتُصرف على الأساسي'),
    ],
    guide: [
      {
        h: L('Who gets gratuity', 'من يستحق المكافأة'),
        p: [
          L(
            'Every full-time private-sector employee on the mainland who finishes at least one year of continuous service is entitled to gratuity under Article 51 of Federal Decree-Law No. 33 of 2021. Since February 2022 all contracts are fixed-term, and resigning no longer reduces the amount. If you resign after 3 years, you get the same gratuity as someone whose contract the employer ended.',
            'يستحق كل موظف بدوام كامل في القطاع الخاص أتم سنة خدمة متصلة على الأقل مكافأة نهاية الخدمة وفق المادة 51 من المرسوم بقانون اتحادي رقم 33 لسنة 2021. منذ فبراير 2022 أصبحت كل العقود محددة المدة، ولم تعد الاستقالة تُنقص المكافأة. فإذا استقلت بعد 3 سنوات تحصل على المكافأة نفسها التي يحصل عليها من أنهى صاحب العمل عقده.',
          ),
          L(
            'Gratuity is worked out on your last basic salary only. Housing, transport and other allowances are not included, which is why your offer letter\'s split between basic and allowances matters.',
            'تُحسب المكافأة على آخر راتب أساسي فقط، ولا يدخل فيها بدل السكن أو المواصلات أو البدلات الأخرى، لذلك يهمك توزيع الراتب بين الأساسي والبدلات في عرض العمل.',
          ),
        ],
      },
      {
        h: L('A worked example', 'مثال محلول'),
        p: [
          L(
            'Basic salary AED 8,000, service of 7 years and 9 months. Daily wage is 8,000 ÷ 30 = AED 266.67. The first 5 years give 5 × 21 × 266.67 = AED 28,000. The remaining 2.75 years give 2.75 × 30 × 266.67 = AED 22,000. Total gratuity: AED 50,000, which is under the 2-year cap of AED 192,000.',
            'راتب أساسي 8,000 درهم وخدمة 7 سنوات و9 أشهر. الأجر اليومي 8,000 ÷ 30 = 266.67 درهم. أول 5 سنوات: 5 × 21 × 266.67 = 28,000 درهم. السنوات المتبقية 2.75: ‏2.75 × 30 × 266.67 = 22,000 درهم. إجمالي المكافأة 50,000 درهم، وهو أقل من الحد الأقصى البالغ 192,000 درهم.',
          ),
        ],
      },
      {
        h: L('When it must be paid', 'موعد السداد'),
        p: [
          L(
            'Your employer must pay gratuity and all other dues within 14 days of the contract ending (Article 53). If it is late, you can file a complaint with MOHRE through its app or website, or call 600 590000.',
            'يجب على صاحب العمل دفع المكافأة وجميع المستحقات خلال 14 يومًا من انتهاء العقد (المادة 53). وإذا تأخر، يمكنك تقديم شكوى لوزارة الموارد البشرية والتوطين عبر تطبيقها أو موقعها، أو الاتصال على 600590000.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('Does resigning reduce my gratuity?', 'هل تُنقص الاستقالة المكافأة؟'),
        a: L(
          'No. Under the 2022 law, private-sector gratuity is the same whether you resign or the employer ends the contract, as long as you have at least one year of service.',
          'لا. وفق قانون 2022 تكون المكافأة في القطاع الخاص واحدة سواء استقلت أو أنهى صاحب العمل العقد، ما دامت خدمتك سنة على الأقل.',
        ),
      },
      {
        q: L('Are allowances included?', 'هل تدخل البدلات في الحساب؟'),
        a: L('No. Only the last basic salary is used.', 'لا. يُستخدم آخر راتب أساسي فقط.'),
      },
      {
        q: L('I got a raise during my service. Which salary is used?', 'حصلت على زيادة أثناء خدمتي. أي راتب يُستخدم؟'),
        a: L(
          'Your last basic salary, for the whole period, including the years before the raise. A raise only counts if it was added to basic pay, not to allowances.',
          'آخر راتب أساسي، عن كامل المدة بما فيها السنوات قبل الزيادة. ولا تُحتسب الزيادة إلا إذا أُضيفت إلى الراتب الأساسي وليس إلى البدلات.',
        ),
      },
      {
        q: L('Is unused annual leave paid on top of gratuity?', 'هل تُصرف الإجازة السنوية غير المستخدمة إضافة إلى المكافأة؟'),
        a: L(
          'Yes. Unused leave days you are owed are paid separately on your basic salary when you leave. Enter them in the optional field above to see both together. If your contract counts leave in working days (for example 22 or 24 a year), choose that option so each day is valued correctly.',
          'نعم. تُصرف أيام الإجازة المستحقة غير المستخدمة بشكل منفصل على راتبك الأساسي عند ترك العمل. أدخلها في الحقل الاختياري أعلاه لترى المبلغين معًا. وإذا كان عقدك يحتسب الإجازة بأيام العمل (مثل 22 أو 24 يومًا في السنة)، فاختر ذلك ليُقيَّم كل يوم بشكل صحيح.',
        ),
      },
      {
        q: L('Can my employer deduct money from gratuity?', 'هل يحق لصاحب العمل الخصم من المكافأة؟'),
        a: L(
          'The employer can deduct amounts you owe it, such as a loan or advance, under Article 51. It cannot deduct anything else without a legal basis.',
          'يحق لصاحب العمل خصم المبالغ المستحقة له عليك مثل القروض أو السلف وفق المادة 51، ولا يجوز له خصم غير ذلك دون سند قانوني.',
        ),
      },
      {
        q: L('Why is my result different from my employer\'s?', 'لماذا تختلف نتيجتي عن حساب صاحب العمل؟'),
        a: L(
          'The usual reasons are a different daily wage method (÷ 30 or × 12 ÷ 365), unpaid leave being deducted, or a different basic salary on record. Try switching the daily wage method above.',
          'الأسباب الشائعة: طريقة مختلفة لحساب الأجر اليومي (÷ 30 أو × 12 ÷ 365)، أو خصم إجازة غير مدفوعة، أو راتب أساسي مختلف في السجلات. جرّب تغيير طريقة الأجر اليومي أعلاه.',
        ),
      },
    ],
    law: L('Federal Decree-Law No. 33 of 2021, Articles 51 to 53', 'المرسوم بقانون اتحادي رقم 33 لسنة 2021، المواد 51 إلى 53'),
    related: ['uae-settlement', 'uae-leave', 'uae-freezone', 'uae-government'],
  },

  {
    slug: 'uae/free-zone-gratuity-calculator/',
    calc: 'uae-freezone',
    group: 'uae-eos',
    title: L('Free Zone Gratuity Calculator (JAFZA, DMCC and others)', 'حاسبة مكافأة نهاية الخدمة في المناطق الحرة (جافزا وغيرها)'),
    metaTitle: L('Free Zone Gratuity Calculator UAE – JAFZA, DMCC, DAFZA', 'حاسبة مكافأة نهاية الخدمة في المناطق الحرة بالإمارات'),
    description: L(
      'End-of-service gratuity for employees of JAFZA, DMCC, DAFZA, DSO, RAKEZ and other UAE free zones that follow the federal labour law.',
      'مكافأة نهاية الخدمة لموظفي جافزا ومركز دبي للسلع المتعددة وداف زا وراكز وغيرها من المناطق الحرة التي تتبع قانون العمل الاتحادي.',
    ),
    card: L('JAFZA, DMCC, DAFZA, DSO, RAKEZ and other free zones.', 'جافزا ومركز دبي للسلع المتعددة وداف زا وراكز وغيرها.'),
    keywords: L('free zone jafza dmcc dafza dso rakez saif gratuity', 'منطقة حرة جافزا مكافأة'),
    intro: L(
      'Most UAE free zones apply the federal Labour Law to gratuity, so the formula is the same as on the mainland. DIFC and ADGM are the exceptions and have their own employment laws.',
      'تطبق معظم المناطق الحرة في الإمارات قانون العمل الاتحادي على مكافأة نهاية الخدمة، لذا فالصيغة نفسها المطبقة في البر الرئيسي. ويُستثنى من ذلك مركز دبي المالي العالمي وسوق أبوظبي العالمي لأن لكل منهما قانون عمل خاص.',
    ),
    how: [
      L('Daily wage = basic salary ÷ 30', 'الأجر اليومي = الراتب الأساسي ÷ 30'),
      L('21 days per year for the first 5 years', '21 يومًا عن كل سنة لأول 5 سنوات'),
      L('30 days per year after that', '30 يومًا عن كل سنة بعدها'),
      L('No gratuity under 1 year', 'لا مكافأة قبل إتمام سنة'),
      L('Maximum 2 years\' wage', 'الحد الأقصى أجر سنتين'),
    ],
    guide: [
      {
        h: L('Which law applies in a free zone', 'أي قانون يطبق في المنطقة الحرة'),
        p: [
          L(
            'Federal Decree-Law No. 33 of 2021 covers free-zone employers unless a free zone\'s own rules say otherwise. JAFZA, DMCC, DAFZA, Dubai Silicon Oasis, Dubai South, RAKEZ, SAIF Zone and most others follow the federal gratuity formula. Your employment contract is usually signed through the free-zone authority, but your rights come from the federal law.',
            'يسري المرسوم بقانون اتحادي رقم 33 لسنة 2021 على أصحاب العمل في المناطق الحرة ما لم تنص أنظمة المنطقة على خلاف ذلك. وتتبع جافزا ومركز دبي للسلع المتعددة وداف زا وواحة دبي للسيليكون ودبي الجنوب وراكز والمنطقة الحرة بمطار الشارقة ومعظم المناطق الأخرى صيغة المكافأة الاتحادية. يُوقَّع العقد عادة عبر سلطة المنطقة الحرة، لكن حقوقك مصدرها القانون الاتحادي.',
          ),
        ],
      },
      {
        h: L('DIFC and ADGM are different', 'مركز دبي المالي العالمي وسوق أبوظبي العالمي مختلفان'),
        p: [
          L(
            'DIFC replaced gratuity with the DEWS savings plan in February 2020. ADGM has its own Employment Regulations and lets employers use a qualifying savings scheme. If you work in DIFC, use the DIFC DEWS calculator instead.',
            'استبدل مركز دبي المالي العالمي المكافأة ببرنامج الادخار DEWS في فبراير 2020. ولسوق أبوظبي العالمي لوائح توظيف خاصة تسمح لأصحاب العمل باستخدام برنامج ادخار معتمد. إذا كنت تعمل في مركز دبي المالي العالمي فاستخدم حاسبة DEWS.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('Is JAFZA gratuity different from mainland gratuity?', 'هل تختلف مكافأة جافزا عن البر الرئيسي؟'),
        a: L('No. JAFZA follows the same 21-day and 30-day formula and the same 2-year cap.', 'لا. تتبع جافزا صيغة 21 و30 يومًا نفسها والحد الأقصى نفسه البالغ أجر سنتين.'),
      },
      {
        q: L('Who do I complain to if my free-zone employer does not pay?', 'لمن أشتكي إذا لم يدفع صاحب العمل في المنطقة الحرة؟'),
        a: L(
          'Start with the free-zone authority\'s employee relations or HR team. If that does not resolve it, the dispute can go to the labour courts.',
          'ابدأ بقسم علاقات الموظفين في سلطة المنطقة الحرة. وإذا لم تُحل المشكلة يمكن رفع النزاع إلى المحاكم العمالية.',
        ),
      },
    ],
    law: L('Federal Decree-Law No. 33 of 2021, Article 51; free zone employment regulations', 'المرسوم بقانون اتحادي رقم 33 لسنة 2021، المادة 51؛ أنظمة التوظيف في المناطق الحرة'),
    related: ['uae-gratuity', 'uae-difc', 'uae-settlement'],
  },

  {
    slug: 'uae/difc-dews-calculator/',
    calc: 'uae-difc',
    group: 'uae-eos',
    title: L('DIFC DEWS and Gratuity Calculator', 'حاسبة DEWS ومكافأة نهاية الخدمة في مركز دبي المالي العالمي'),
    metaTitle: L('DIFC DEWS Calculator – End of Service Savings and Pre-2020 Gratuity', 'حاسبة DEWS في مركز دبي المالي العالمي'),
    description: L(
      'Estimate your DIFC end-of-service benefit: gratuity for service before February 2020 plus DEWS contributions of 5.83% or 8.33% of basic salary.',
      'قدّر مستحقات نهاية الخدمة في مركز دبي المالي العالمي: مكافأة الخدمة قبل فبراير 2020 واشتراكات DEWS بنسبة 5.83% أو 8.33% من الراتب الأساسي.',
    ),
    card: L('Pre-2020 gratuity plus DEWS at 5.83% or 8.33% a month.', 'مكافأة ما قبل 2020 واشتراكات DEWS بنسبة 5.83% أو 8.33%.'),
    keywords: L('difc dews savings plan qualifying scheme', 'مركز دبي المالي ديوز ادخار'),
    intro: L(
      'Gratuity in DIFC stopped building up on 31 January 2020. Since then your employer pays into the DIFC Employee Workplace Savings plan (DEWS) every month. This calculator adds both parts together.',
      'توقف احتساب المكافأة في مركز دبي المالي العالمي في 31 يناير 2020، ومنذ ذلك الحين يدفع صاحب العمل اشتراكًا شهريًا في برنامج DEWS لادخار الموظفين. تجمع هذه الحاسبة الجزأين معًا.',
    ),
    how: [
      L('Before 1 Feb 2020: 21 days of basic per year (30 after 5 years)', 'قبل 1 فبراير 2020: أجر 21 يومًا أساسيًا عن كل سنة (30 بعد 5 سنوات)'),
      L('From 1 Feb 2020: 5.83% of monthly basic into DEWS', 'من 1 فبراير 2020: ‏5.83% من الأساسي الشهري في DEWS'),
      L('After 5 years of service: 8.33% a month', 'بعد 5 سنوات خدمة: ‏8.33% شهريًا'),
      L('Optional: add an assumed investment return', 'اختياري: أضف عائد استثمار مفترضًا'),
    ],
    guide: [
      {
        h: L('How DEWS works', 'كيف يعمل DEWS'),
        p: [
          L(
            'DEWS is a funded savings plan. Each month your employer pays 5.83% of your basic salary (8.33% once you pass 5 years of service) into an account in your name. The money is invested, so the amount you leave with depends on the funds you choose. You can also add your own voluntary contributions.',
            'DEWS برنامج ادخار ممول. يدفع صاحب العمل كل شهر 5.83% من راتبك الأساسي (و8.33% بعد تجاوز 5 سنوات خدمة) في حساب باسمك. تُستثمر الأموال، لذا يعتمد المبلغ النهائي على الصناديق التي تختارها. ويمكنك إضافة اشتراكات طوعية من جهتك.',
          ),
          L(
            'The rates match the old gratuity formula: 21 days ÷ 360 = 5.83% and 30 days ÷ 360 = 8.33%. The difference is that the money is set aside every month rather than paid as one sum at the end.',
            'تتطابق النسب مع صيغة المكافأة القديمة: 21 يومًا ÷ 360 = 5.83% و30 يومًا ÷ 360 = 8.33%. والفرق أن المال يُجنَّب شهريًا بدلًا من دفعه مبلغًا واحدًا في النهاية.',
          ),
        ],
      },
      {
        h: L('Service before February 2020', 'الخدمة قبل فبراير 2020'),
        p: [
          L(
            'Gratuity you built up before 1 February 2020 is still owed. Employers could either move it into DEWS or pay it when you leave. This calculator uses your current basic salary for that part, as DIFC guidance describes; your employer may have frozen it at an earlier salary, so check your DEWS statement.',
            'المكافأة المتراكمة قبل 1 فبراير 2020 ما زالت مستحقة. وكان لأصحاب العمل الخيار بين نقلها إلى DEWS أو دفعها عند انتهاء الخدمة. تستخدم الحاسبة راتبك الأساسي الحالي لهذا الجزء وفق إرشادات المركز، وقد يكون صاحب العمل ثبّتها على راتب سابق، فراجع كشف حساب DEWS.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('Can I withdraw DEWS before I leave?', 'هل يمكنني سحب أموال DEWS قبل ترك العمل؟'),
        a: L('No. The employer contributions are paid out when your employment ends.', 'لا. تُصرف اشتراكات صاحب العمل عند انتهاء خدمتك.'),
      },
      {
        q: L('Does my employer have to use DEWS?', 'هل يجب على صاحب العمل استخدام DEWS؟'),
        a: L(
          'DIFC employers must use DEWS or another qualifying scheme approved by the DIFC.',
          'يجب على أصحاب العمل في المركز استخدام DEWS أو برنامج ادخار آخر معتمد من المركز.',
        ),
      },
    ],
    law: L('DIFC Employment Law No. 2 of 2019 and DEWS regulations', 'قانون التوظيف في مركز دبي المالي العالمي رقم 2 لسنة 2019 ولوائح DEWS'),
    related: ['uae-freezone', 'uae-gratuity', 'loan-emi'],
  },

  {
    slug: 'uae/government-gratuity-calculator/',
    calc: 'uae-government',
    group: 'uae-eos',
    title: L('UAE Federal Government Gratuity Calculator', 'حاسبة مكافأة نهاية الخدمة في الحكومة الاتحادية'),
    metaTitle: L('UAE Government Gratuity Calculator – Federal HR Law 49/2022', 'حاسبة مكافأة نهاية الخدمة الحكومية – قانون الموارد البشرية الاتحادي'),
    description: L(
      'End-of-service gratuity for non-UAE-national employees of federal government entities, under Federal Decree-Law No. 49 of 2022.',
      'مكافأة نهاية الخدمة لغير المواطنين العاملين في الجهات الحكومية الاتحادية وفق المرسوم بقانون اتحادي رقم 49 لسنة 2022.',
    ),
    card: L('Federal entities, for non-UAE nationals. Notice and leave count.', 'الجهات الاتحادية لغير المواطنين. يُحتسب الإنذار والإجازة.'),
    keywords: L('government federal ministry public sector fahr', 'حكومة اتحادية وزارة قطاع حكومي'),
    intro: L(
      'Non-UAE nationals working full time for a federal ministry or authority receive an end-of-service gratuity. The federal rules count your notice period and unused leave as service and round part months up.',
      'يحصل غير المواطنين العاملين بدوام كامل في وزارة أو هيئة اتحادية على مكافأة نهاية الخدمة. وتحتسب القواعد الاتحادية مدة الإنذار والإجازة غير المستخدمة ضمن الخدمة، وتعدّ جزء الشهر شهرًا كاملًا.',
    ),
    how: [
      L('Daily salary = basic salary ÷ 30', 'الراتب اليومي = الراتب الأساسي ÷ 30'),
      L('21 days per year for the first 5 years', '21 يومًا عن كل سنة لأول 5 سنوات'),
      L('30 days per year after that', '30 يومًا عن كل سنة بعدها'),
      L('Notice period and unused leave count as service', 'تُحتسب مدة الإنذار والإجازة غير المستخدمة ضمن الخدمة'),
      L('Part of a month counts as a full month', 'جزء الشهر يُعدّ شهرًا كاملًا'),
      L('Nothing under 1 continuous year', 'لا مكافأة قبل سنة متصلة'),
    ],
    guide: [
      {
        h: L('The federal rule', 'القاعدة الاتحادية'),
        p: [
          L(
            'Article 41 of Federal Decree-Law No. 49 of 2022 on Human Resources in the Federal Government gives full-time non-national employees 21 days of basic salary for each of the first five years and 30 days for each year after. It came into force on 2 January 2023. Part-time and other work patterns are paid in proportion.',
            'تمنح المادة 41 من المرسوم بقانون اتحادي رقم 49 لسنة 2022 بشأن الموارد البشرية في الحكومة الاتحادية الموظف غير المواطن بدوام كامل أجر 21 يومًا من الراتب الأساسي عن كل سنة من السنوات الخمس الأولى، و30 يومًا عن كل سنة بعدها. وقد نفذ القانون في 2 يناير 2023. ويُحتسب الدوام الجزئي وأنماط العمل الأخرى بالتناسب.',
          ),
          L(
            'For employees who were already in service, Article 42 says the period before 2 January 2023 is calculated under the entity\'s earlier rules, and the new formula applies from that date. Ask your HR department for the figure for your earlier service.',
            'وبالنسبة للموظفين القائمين على رأس عملهم، تنص المادة 42 على احتساب الفترة السابقة لـ 2 يناير 2023 وفق الأنظمة السابقة في الجهة، وتطبيق الصيغة الجديدة من ذلك التاريخ. اطلب من إدارة الموارد البشرية مبلغ خدمتك السابقة.',
          ),
        ],
      },
      {
        h: L('UAE nationals and local governments', 'المواطنون والحكومات المحلية'),
        p: [
          L(
            'UAE nationals do not get gratuity: their end-of-service benefits come from the pension law (GPSSA). Emirate governments such as Dubai, Abu Dhabi and Sharjah have their own HR laws, which may differ from the federal formula.',
            'لا يحصل المواطنون على مكافأة نهاية الخدمة، إذ تأتي مستحقاتهم من قانون المعاشات (الهيئة العامة للمعاشات والتأمينات الاجتماعية). ولحكومات الإمارات المحلية مثل دبي وأبوظبي والشارقة قوانين موارد بشرية خاصة قد تختلف عن الصيغة الاتحادية.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('Is there a maximum?', 'هل يوجد حد أقصى؟'),
        a: L('Article 41 does not set a cap like the private-sector 2-year limit.', 'لا تنص المادة 41 على حد أقصى مثل حد السنتين في القطاع الخاص.'),
      },
      {
        q: L('Does my notice period really count?', 'هل تُحتسب مدة الإنذار فعلًا؟'),
        a: L(
          'Yes. The notice period and the unused leave days you are owed are added to your service before the gratuity is worked out.',
          'نعم. تُضاف مدة الإنذار وأيام الإجازة المستحقة غير المستخدمة إلى مدة خدمتك قبل حساب المكافأة.',
        ),
      },
    ],
    law: L('Federal Decree-Law No. 49 of 2022, Articles 41 and 42', 'المرسوم بقانون اتحادي رقم 49 لسنة 2022، المادتان 41 و42'),
    related: ['uae-gratuity', 'uae-leave', 'uae-notice'],
  },

  {
    slug: 'uae/final-settlement-calculator/',
    calc: 'uae-settlement',
    group: 'uae-eos',
    title: L('UAE Final Settlement Calculator', 'حاسبة التسوية النهائية في الإمارات'),
    metaTitle: L('UAE Final Settlement Calculator – Gratuity, Leave, Salary and Notice', 'حاسبة التسوية النهائية في الإمارات'),
    description: L(
      'Add up everything you are owed when you leave a UAE job: gratuity, unused leave, unpaid salary, notice pay and other dues, minus deductions.',
      'اجمع كل مستحقاتك عند ترك العمل في الإمارات: المكافأة والإجازة غير المستخدمة والراتب غير المدفوع وبدل الإنذار، مطروحًا منها الاستقطاعات.',
    ),
    card: L('Gratuity + leave + salary + notice in one total.', 'المكافأة والإجازة والراتب والإنذار في مبلغ واحد.'),
    keywords: L('final settlement full and final dues exit resignation', 'تسوية نهائية مستحقات استقالة'),
    intro: L(
      'Your final settlement is more than gratuity. It also includes unused annual leave, salary for days already worked, any notice pay and other amounts in your contract. Fill in what applies to you.',
      'التسوية النهائية أكثر من مجرد المكافأة، فهي تشمل الإجازة السنوية غير المستخدمة وراتب الأيام التي عملتها وبدل الإنذار وأي مبالغ أخرى في عقدك. املأ ما ينطبق عليك.',
    ),
    how: [
      L('Gratuity: UAE private-sector formula', 'المكافأة: صيغة القطاع الخاص في الإمارات'),
      L('Unused leave: basic ÷ 30 × days', 'الإجازة غير المستخدمة: الأساسي ÷ 30 × الأيام'),
      L('Unpaid salary and notice: total salary ÷ 30 × days', 'الراتب غير المدفوع والإنذار: إجمالي الراتب ÷ 30 × الأيام'),
      L('Plus other dues, minus deductions', 'مضافًا إليها المستحقات الأخرى ومطروحًا منها الاستقطاعات'),
    ],
    guide: [
      {
        h: L('What goes into a final settlement', 'ما الذي تشمله التسوية النهائية'),
        p: [
          L(
            'A UAE final settlement normally has five parts: end-of-service gratuity, pay for annual leave you did not take, salary for the days worked in your last month, pay in lieu of notice if notice was not worked, and any contract benefits such as a ticket allowance. The employer can deduct amounts you owe, such as an outstanding loan.',
            'تتكون التسوية النهائية في الإمارات عادة من خمسة أجزاء: مكافأة نهاية الخدمة، وبدل الإجازة السنوية غير المستخدمة، وراتب الأيام التي عملتها في الشهر الأخير، وبدل الإنذار إذا لم تعمل خلاله، وأي مزايا في العقد مثل بدل التذكرة. ويحق لصاحب العمل خصم ما عليك من مبالغ مثل قرض قائم.',
          ),
        ],
      },
      {
        h: L('Before you sign', 'قبل التوقيع'),
        p: [
          L(
            'Ask for a written breakdown and compare it with this calculator. Check that the basic salary, joining date and leave balance match your records. Signing a settlement usually means you accept it as full and final, so raise any difference first.',
            'اطلب تفصيلًا مكتوبًا وقارنه بهذه الحاسبة، وتأكد من تطابق الراتب الأساسي وتاريخ الالتحاق ورصيد الإجازات مع سجلاتك. التوقيع على التسوية يعني غالبًا قبولها نهائيًا، فاعترض على أي فرق قبل التوقيع.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('How fast must the settlement be paid?', 'متى يجب دفع التسوية؟'),
        a: L('Within 14 days of the contract ending.', 'خلال 14 يومًا من انتهاء العقد.'),
      },
      {
        q: L('Is unused leave paid on basic or total salary?', 'هل يُحسب بدل الإجازة على الأساسي أم الإجمالي؟'),
        a: L('On basic salary, under Article 29.', 'على الراتب الأساسي وفق المادة 29.'),
      },
    ],
    law: L('Federal Decree-Law No. 33 of 2021, Articles 29, 43, 51 and 53', 'المرسوم بقانون اتحادي رقم 33 لسنة 2021، المواد 29 و43 و51 و53'),
    related: ['uae-gratuity', 'uae-leave', 'uae-notice'],
  },

  {
    slug: 'uae/leave-salary-calculator/',
    calc: 'uae-leave',
    group: 'uae-pay',
    title: L('UAE Leave Salary Calculator', 'حاسبة راتب الإجازة في الإمارات'),
    metaTitle: L('UAE Leave Salary Calculator – Annual Leave Pay and Encashment', 'حاسبة راتب الإجازة السنوية وبدلها في الإمارات'),
    description: L(
      'Work out your annual leave salary and the payout for unused leave days in the UAE, with your yearly leave entitlement.',
      'احسب راتب إجازتك السنوية وبدل أيام الإجازة غير المستخدمة في الإمارات، مع عدد أيام إجازتك السنوية.',
    ),
    card: L('Annual leave pay and unused leave payout.', 'راتب الإجازة السنوية وبدل الإجازة غير المستخدمة.'),
    keywords: L('leave salary annual leave encashment vacation', 'راتب الإجازة إجازة سنوية بدل'),
    intro: L(
      'Find out how much you are paid for annual leave and how much unused days are worth when you leave your job.',
      'اعرف كم تتقاضى عن إجازتك السنوية، وكم تساوي الأيام غير المستخدمة عند ترك العمل.',
    ),
    how: [
      L('On leave: (basic + housing) ÷ 30 × days', 'أثناء الإجازة: (الأساسي + السكن) ÷ 30 × الأيام'),
      L('Unused days at exit: basic ÷ 30 × days', 'الأيام غير المستخدمة عند ترك العمل: الأساسي ÷ 30 × الأيام'),
      L('Leave in working days: × 12 ÷ 260 (5-day week)', 'الإجازة بأيام العمل: × 12 ÷ 260 (أسبوع من 5 أيام)'),
      L('6 to 12 months of service: 2 days per month', 'من 6 إلى 12 شهرًا: يومان عن كل شهر'),
      L('After 1 year: 30 days a year', 'بعد سنة: 30 يومًا سنويًا'),
    ],
    guide: [
      {
        h: L('How much leave you earn', 'كم يوم إجازة تستحق'),
        p: [
          L(
            'Under Article 29 of the Labour Law you earn 2 days of paid leave for each month once you have worked 6 months, and 30 days a year after your first year. Part-time workers earn leave in proportion to their hours. Public holidays inside your leave are not counted as leave days.',
            'وفق المادة 29 من قانون العمل تستحق يومين إجازة مدفوعة عن كل شهر بعد إتمام 6 أشهر، و30 يومًا سنويًا بعد السنة الأولى. ويستحق العامل بدوام جزئي إجازة بنسبة ساعات عمله. ولا تُحتسب العطلات الرسمية الواقعة ضمن الإجازة من أيامها.',
          ),
        ],
      },
      {
        h: L('Leave salary versus leave encashment', 'راتب الإجازة وبدل الإجازة'),
        p: [
          L(
            'While you are on annual leave you are paid your basic salary plus housing allowance. When you leave the company, any unused days you are owed are paid on your basic salary only. Employers may limit how many days you carry over, so check your contract.',
            'أثناء الإجازة السنوية تتقاضى راتبك الأساسي مع بدل السكن. وعند ترك الشركة تُصرف لك الأيام المستحقة غير المستخدمة على أساس الراتب الأساسي فقط. وقد يحدد صاحب العمل عدد الأيام القابلة للترحيل، فراجع عقدك.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('Can my employer refuse to pay unused leave?', 'هل يحق لصاحب العمل رفض دفع بدل الإجازة؟'),
        a: L(
          'No. Unused leave you are owed must be paid when the contract ends, whatever the length of your service.',
          'لا. يجب دفع بدل الإجازة المستحقة غير المستخدمة عند انتهاء العقد مهما كانت مدة خدمتك.',
        ),
      },
      {
        q: L('My company gives 24 working days, not 30. How is a day valued?', 'شركتي تمنح 24 يوم عمل وليس 30. كيف يُقيَّم اليوم؟'),
        a: L(
          'The law sets 30 calendar days and values a day at salary ÷ 30. If your leave is counted in working days, a day is worth more: salary × 12 ÷ 260 for a 5-day week, or ÷ 312 for a 6-day week. 24 working days usually covers about the same time off as 30 calendar days. Choose how your company counts leave in the form.',
          'يحدد القانون 30 يومًا تقويميًا ويُقيَّم اليوم بالراتب ÷ 30. أما إذا كانت الإجازة تُحتسب بأيام العمل فقيمة اليوم أعلى: الراتب × 12 ÷ 260 لأسبوع من 5 أيام، أو ÷ 312 لأسبوع من 6 أيام. و24 يوم عمل تعادل عادة المدة نفسها تقريبًا التي تغطيها 30 يومًا تقويميًا. اختر طريقة احتساب شركتك للإجازة في النموذج.',
        ),
      },
      {
        q: L('Is leave salary paid before I travel?', 'هل يُدفع راتب الإجازة قبل السفر؟'),
        a: L('The law says leave pay should be paid before the leave starts.', 'ينص القانون على دفع راتب الإجازة قبل بدايتها.'),
      },
    ],
    law: L('Federal Decree-Law No. 33 of 2021, Article 29', 'المرسوم بقانون اتحادي رقم 33 لسنة 2021، المادة 29'),
    related: ['uae-settlement', 'uae-gratuity', 'uae-overtime'],
  },

  {
    slug: 'uae/overtime-calculator/',
    calc: 'uae-overtime',
    group: 'uae-pay',
    title: L('UAE Overtime Calculator', 'حاسبة العمل الإضافي في الإمارات'),
    metaTitle: L('UAE Overtime Calculator 2026 – 25% and 50% Rates', 'حاسبة العمل الإضافي في الإمارات 2026'),
    description: L(
      'Calculate overtime pay in the UAE: +25% for normal overtime and +50% for nights, rest days and public holidays, based on your basic salary.',
      'احسب أجر العمل الإضافي في الإمارات: زيادة 25% للعمل الإضافي العادي و50% للعمل الليلي وأيام الراحة والعطلات الرسمية.',
    ),
    card: L('+25% normal hours, +50% nights, rest days and holidays.', '+25% للساعات العادية، و+50% لليل والراحة والعطلات.'),
    keywords: L('overtime extra hours night shift holiday rest day', 'عمل إضافي ساعات ليل عطلة'),
    intro: L(
      'Enter your basic salary and the extra hours you worked to see your overtime pay under the UAE Labour Law.',
      'أدخل راتبك الأساسي والساعات الإضافية التي عملتها لترى أجر العمل الإضافي وفق قانون العمل الإماراتي.',
    ),
    how: [
      L('Hourly wage = basic ÷ 30 ÷ 8', 'أجر الساعة = الأساسي ÷ 30 ÷ 8'),
      L('Normal overtime: hourly wage + 25%', 'العمل الإضافي العادي: أجر الساعة + 25%'),
      L('10 pm to 4 am: hourly wage + 50%', 'من 10 مساءً إلى 4 صباحًا: أجر الساعة + 50%'),
      L('Rest day or public holiday: + 50% (if no day off in place)', 'يوم الراحة أو العطلة: + 50% (إن لم يُمنح يوم بديل)'),
    ],
    guide: [
      {
        h: L('The overtime rules', 'قواعد العمل الإضافي'),
        p: [
          L(
            'Normal working hours in the UAE private sector are up to 8 hours a day and 48 hours a week. Overtime cannot be more than 2 hours a day, and total working hours cannot go over 144 in any 3 weeks. Overtime is paid at your hourly basic wage plus 25%, or plus 50% for hours between 10 pm and 4 am.',
            'ساعات العمل العادية في القطاع الخاص بالإمارات حتى 8 ساعات يوميًا و48 ساعة أسبوعيًا. ولا يجوز أن يزيد العمل الإضافي على ساعتين يوميًا، ولا أن يتجاوز مجموع ساعات العمل 144 ساعة خلال 3 أسابيع. ويُدفع العمل الإضافي بأجر الساعة الأساسي مضافًا إليه 25%، أو 50% للساعات بين 10 مساءً و4 صباحًا.',
          ),
          L(
            'If you work on your rest day or a public holiday, the employer must give you another day off or pay your wage for that time plus at least 50%.',
            'وإذا عملت في يوم راحتك أو في عطلة رسمية، فعلى صاحب العمل منحك يومًا بديلًا أو دفع أجرك عن ذلك الوقت مع زيادة لا تقل عن 50%.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('Do managers get overtime?', 'هل يستحق المديرون أجر العمل الإضافي؟'),
        a: L(
          'Supervisory and management roles with authority over other staff are usually excluded from the overtime rules.',
          'تُستثنى عادة الوظائف الإشرافية والإدارية التي تملك صلاحيات على الموظفين من قواعد العمل الإضافي.',
        ),
      },
      {
        q: L('Is overtime based on basic or total salary?', 'هل يُحسب العمل الإضافي على الأساسي أم الإجمالي؟'),
        a: L('On basic salary.', 'على الراتب الأساسي.'),
      },
    ],
    law: L('Federal Decree-Law No. 33 of 2021, Articles 17 to 19 and 28', 'المرسوم بقانون اتحادي رقم 33 لسنة 2021، المواد 17 إلى 19 و28'),
    related: ['salary', 'uae-leave', 'uae-settlement'],
  },

  {
    slug: 'uae/notice-period-calculator/',
    calc: 'uae-notice',
    group: 'uae-pay',
    title: L('UAE Notice Period Calculator', 'حاسبة مدة الإنذار في الإمارات'),
    metaTitle: L('UAE Notice Period Calculator – Last Working Day and Pay in Lieu', 'حاسبة مدة الإنذار وآخر يوم عمل في الإمارات'),
    description: L(
      'Find your last working day and the pay in lieu of notice for a 30 to 90 day notice period under UAE Labour Law.',
      'اعرف آخر يوم عمل لك وبدل الإنذار لمدة إنذار من 30 إلى 90 يومًا وفق قانون العمل الإماراتي.',
    ),
    card: L('Last working day and pay in lieu of notice.', 'آخر يوم عمل وبدل الإنذار.'),
    keywords: L('notice period resignation last working day pay in lieu', 'مدة الإنذار استقالة آخر يوم'),
    intro: L(
      'Pick the date you hand in or receive notice and the notice period in your contract to see your last working day and what the notice is worth.',
      'اختر تاريخ تقديم الإنذار أو استلامه ومدة الإنذار في عقدك، لترى آخر يوم عمل وقيمة بدل الإنذار.',
    ),
    how: [
      L('Notice: at least 30 days, at most 90 days', 'الإنذار: 30 يومًا على الأقل و90 يومًا على الأكثر'),
      L('The day notice is given is day 1', 'يوم تقديم الإنذار هو اليوم الأول'),
      L('Pay in lieu: total salary ÷ 30 × days', 'بدل الإنذار: إجمالي الراتب ÷ 30 × الأيام'),
    ],
    guide: [
      {
        h: L('Notice rules in the UAE', 'قواعد الإنذار في الإمارات'),
        p: [
          L(
            'Either side can end an employment contract with written notice. Article 43 sets the notice period at between 30 and 90 days, as agreed in the contract. You keep working and are paid in full during the notice period. If the employer or the employee does not want the notice worked, the side that ends it early pays the wage for the days that remain.',
            'يحق لأي من الطرفين إنهاء عقد العمل بإنذار كتابي. وتحدد المادة 43 مدة الإنذار بين 30 و90 يومًا وفق ما يتفق عليه في العقد. وتستمر في العمل وتتقاضى أجرك كاملًا خلال مدة الإنذار. وإذا لم يرغب أحد الطرفين في العمل خلال مدة الإنذار، يدفع الطرف الذي أنهاه مبكرًا أجر الأيام المتبقية.',
          ),
          L(
            'Notice runs while you are on the job. If you are on sick leave or annual leave, check with your employer how those days count toward the notice period.',
            'تسري مدة الإنذار أثناء عملك. وإذا كنت في إجازة مرضية أو سنوية فتحقق مع صاحب العمل من طريقة احتساب تلك الأيام ضمن مدة الإنذار.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('Can I leave during probation without notice?', 'هل يمكنني ترك العمل أثناء فترة التجربة دون إنذار؟'),
        a: L(
          'No. During probation you must give 14 days\' notice to leave the UAE, or 30 days to move to another UAE employer.',
          'لا. أثناء فترة التجربة يجب تقديم إنذار 14 يومًا لمغادرة الدولة، أو 30 يومًا للانتقال إلى صاحب عمل آخر في الدولة.',
        ),
      },
      {
        q: L('Is pay in lieu based on basic or total salary?', 'هل يُحسب بدل الإنذار على الأساسي أم الإجمالي؟'),
        a: L('On the full wage, including allowances.', 'على الأجر الكامل شاملًا البدلات.'),
      },
    ],
    law: L('Federal Decree-Law No. 33 of 2021, Articles 9 and 43', 'المرسوم بقانون اتحادي رقم 33 لسنة 2021، المادتان 9 و43'),
    related: ['uae-settlement', 'uae-gratuity', 'uae-leave'],
  },

  {
    slug: 'uae/vat-calculator/',
    calc: 'uae-vat',
    group: 'money',
    title: L('UAE VAT Calculator', 'حاسبة ضريبة القيمة المضافة في الإمارات'),
    metaTitle: L('UAE VAT Calculator – Add or Remove 5% VAT', 'حاسبة ضريبة القيمة المضافة 5% في الإمارات'),
    description: L(
      'Add 5% UAE VAT to a price or take VAT out of a price that already includes it, with the net, VAT and total amounts.',
      'أضف ضريبة القيمة المضافة 5% إلى السعر أو استخرجها من سعر شامل لها، مع المبلغ الصافي والضريبة والإجمالي.',
    ),
    card: L('Add or remove 5% VAT from any amount.', 'أضف أو استخرج ضريبة 5% من أي مبلغ.'),
    keywords: L('vat tax 5% fta invoice', 'ضريبة القيمة المضافة 5% فاتورة'),
    intro: L(
      'Add 5% VAT to a net price, or work backwards from a price that already includes VAT.',
      'أضف ضريبة 5% إلى السعر الصافي، أو احسب عكسيًا من سعر يشمل الضريبة.',
    ),
    how: [
      L('Add VAT: price × 1.05', 'إضافة الضريبة: السعر × 1.05'),
      L('Remove VAT: price ÷ 1.05', 'استخراج الضريبة: السعر ÷ 1.05'),
      L('VAT amount = total − net', 'مبلغ الضريبة = الإجمالي − الصافي'),
    ],
    guide: [
      {
        h: L('About UAE VAT', 'عن ضريبة القيمة المضافة في الإمارات'),
        p: [
          L(
            'VAT was introduced in the UAE on 1 January 2018 at a standard rate of 5%. Some supplies are zero-rated, such as exports and some education and healthcare, and some are exempt, such as residential rent and local passenger transport. Businesses must register once taxable supplies pass AED 375,000 a year.',
            'طُبقت ضريبة القيمة المضافة في الإمارات في 1 يناير 2018 بنسبة قياسية 5%. وبعض التوريدات خاضعة لنسبة صفر مثل الصادرات وبعض خدمات التعليم والرعاية الصحية، وبعضها معفى مثل الإيجار السكني والنقل المحلي للركاب. ويجب على الأعمال التسجيل عند تجاوز التوريدات الخاضعة 375,000 درهم سنويًا.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('How do I find the VAT in a price that includes it?', 'كيف أعرف الضريبة في سعر شامل لها؟'),
        a: L('Divide the price by 1.05 to get the net amount. The VAT is the difference, or price × 5 ÷ 105.', 'اقسم السعر على 1.05 لتحصل على الصافي. والضريبة هي الفرق، أو السعر × 5 ÷ 105.'),
      },
    ],
    law: L('Federal Decree-Law No. 8 of 2017 on Value Added Tax', 'المرسوم بقانون اتحادي رقم 8 لسنة 2017 في شأن ضريبة القيمة المضافة'),
    related: ['loan-emi', 'uae-mortgage', 'salary'],
  },

  {
    slug: 'loan-emi-calculator/',
    calc: 'loan-emi',
    group: 'money',
    title: L('Loan and Car EMI Calculator', 'حاسبة أقساط القروض والسيارات'),
    metaTitle: L('Loan EMI Calculator UAE & GCC – Flat vs Reducing Rate', 'حاسبة أقساط القرض – فائدة ثابتة أو متناقصة'),
    description: L(
      'Monthly payment, total interest and a yearly schedule for personal and car loans. Converts a flat rate to its real reducing-balance rate.',
      'القسط الشهري وإجمالي الفائدة وجدول سنوي للقروض الشخصية وقروض السيارات، مع تحويل الفائدة الثابتة إلى ما يعادلها متناقصة.',
    ),
    card: L('Monthly payment, total interest, flat vs reducing rate.', 'القسط الشهري وإجمالي الفائدة، ثابتة أو متناقصة.'),
    keywords: L('loan emi car auto personal finance flat rate reducing', 'قرض قسط سيارة تمويل فائدة'),
    intro: L(
      'Car and personal loans in the Gulf are often advertised with a flat rate, which looks cheaper than it is. Enter the loan and see the real cost.',
      'غالبًا ما تُعلن قروض السيارات والقروض الشخصية في الخليج بفائدة ثابتة تبدو أرخص من حقيقتها. أدخل بيانات القرض واعرف تكلفته الفعلية.',
    ),
    how: [
      L('Reducing: EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1)', 'المتناقصة: القسط = P × r × (1+r)^n ÷ ((1+r)^n − 1)'),
      L('Flat: (loan + loan × rate × years) ÷ months', 'الثابتة: (القرض + القرض × النسبة × السنوات) ÷ الأشهر'),
      L('r = yearly rate ÷ 12, n = number of months', 'r = النسبة السنوية ÷ 12، n = عدد الأشهر'),
    ],
    guide: [
      {
        h: L('Flat rate versus reducing rate', 'الفائدة الثابتة والفائدة المتناقصة'),
        p: [
          L(
            'With a reducing-balance rate, you pay interest only on what you still owe, so interest falls every month. With a flat rate, interest is charged on the original amount for the whole term. A 3.5% flat rate over 4 years costs about the same as a 6.5% reducing rate. Always compare loans by the reducing rate (sometimes shown as APR).',
            'في الفائدة المتناقصة تدفع الفائدة على المبلغ المتبقي فقط، فتقل الفائدة كل شهر. أما في الفائدة الثابتة فتُحتسب على المبلغ الأصلي طوال المدة. فائدة ثابتة 3.5% على 4 سنوات تكلف تقريبًا مثل فائدة متناقصة 6.5%. قارن القروض دائمًا بالفائدة المتناقصة (وتُعرض أحيانًا بالمعدل السنوي APR).',
          ),
        ],
      },
      {
        h: L('UAE lending limits', 'حدود الإقراض في الإمارات'),
        p: [
          L(
            'UAE Central Bank rules cap total monthly debt repayments at 50% of salary, limit personal loans to 20 times your monthly salary, and set the maximum term at 48 months. Car loans can cover up to 80% of the car price.',
            'تحدد قواعد المصرف المركزي الإماراتي مجموع أقساط الديون الشهرية بـ 50% من الراتب، والقروض الشخصية بما لا يزيد على 20 ضعف الراتب الشهري، والمدة القصوى بـ 48 شهرًا. ويمكن أن تغطي قروض السيارات حتى 80% من سعر السيارة.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('What is a good interest rate?', 'ما الفائدة المناسبة؟'),
        a: L('Compare the reducing rate across banks. Salary-transfer loans are usually cheaper than loans without salary transfer.', 'قارن الفائدة المتناقصة بين البنوك. القروض مع تحويل الراتب أرخص عادة من القروض دون تحويل.'),
      },
      {
        q: L('Can I pay off my loan early?', 'هل يمكنني سداد القرض مبكرًا؟'),
        a: L('Yes. In the UAE, banks can charge at most 1% of the remaining balance, capped at AED 10,000.', 'نعم. في الإمارات يحق للبنك تحصيل 1% كحد أقصى من الرصيد المتبقي، بما لا يتجاوز 10,000 درهم.'),
      },
    ],
    law: L('UAE Central Bank regulations on retail loans', 'أنظمة المصرف المركزي الإماراتي بشأن القروض الشخصية'),
    related: ['uae-mortgage', 'salary', 'uae-vat'],
  },

  {
    slug: 'uae/mortgage-calculator/',
    calc: 'uae-mortgage',
    group: 'money',
    title: L('UAE Mortgage and Buying Costs Calculator', 'حاسبة التمويل العقاري وتكاليف الشراء في الإمارات'),
    metaTitle: L('UAE Mortgage Calculator – Monthly Payment and Dubai Buying Costs', 'حاسبة التمويل العقاري في الإمارات وتكاليف الشراء في دبي'),
    description: L(
      'Monthly mortgage payment plus the cash you need upfront in Dubai: down payment, 4% DLD fee, registration, trustee, agent and bank fees.',
      'القسط الشهري للتمويل العقاري والنقد المطلوب مقدمًا في دبي: الدفعة الأولى ورسوم دائرة الأراضي 4% والتسجيل وأمين التسجيل والوسيط والبنك.',
    ),
    card: L('Monthly payment plus 4% DLD and all buying fees.', 'القسط الشهري ورسوم الأراضي 4% وكل تكاليف الشراء.'),
    keywords: L('mortgage home loan property dubai dld buy apartment', 'تمويل عقاري رهن شراء شقة دبي'),
    intro: L(
      'Buying a home in the UAE needs more cash than the down payment. See the monthly payment and every fee you pay on the day of transfer.',
      'شراء منزل في الإمارات يحتاج نقدًا أكثر من الدفعة الأولى. اعرف القسط الشهري وكل الرسوم التي تدفعها يوم نقل الملكية.',
    ),
    how: [
      L('Loan = price − down payment', 'القرض = السعر − الدفعة الأولى'),
      L('Monthly payment uses the reducing-balance formula', 'يُحسب القسط بطريقة الرصيد المتناقص'),
      L('Upfront cash = down payment + all fees', 'النقد المطلوب = الدفعة الأولى + كل الرسوم'),
    ],
    guide: [
      {
        h: L('Down payment rules', 'قواعد الدفعة الأولى'),
        p: [
          L(
            'For a first home up to AED 5 million, UAE Central Bank rules need at least 20% down for expats and 15% for UAE nationals. Above AED 5 million it is 30% and 25%. Off-plan properties need at least 50% down. The maximum term is 25 years.',
            'لأول منزل حتى 5 ملايين درهم، تشترط قواعد المصرف المركزي دفعة أولى لا تقل عن 20% للوافدين و15% للمواطنين. وفوق 5 ملايين تصبح 30% و25%. وتحتاج العقارات على الخريطة إلى 50% على الأقل. والمدة القصوى 25 سنة.',
          ),
        ],
      },
      {
        h: L('Fees on the day of transfer', 'رسوم يوم نقل الملكية'),
        p: [
          L(
            'In Dubai, the Land Department transfer fee is 4% of the price plus admin fees. You also pay mortgage registration (0.25% of the loan), the trustee office, the agent (usually 2%) and the bank\'s arrangement and valuation fees. Together these add 6% to 8% on top of the down payment.',
            'في دبي تبلغ رسوم نقل الملكية لدى دائرة الأراضي 4% من السعر مع رسوم إدارية. وتدفع أيضًا رسوم تسجيل الرهن (0.25% من القرض) ومكتب أمين التسجيل والوسيط (عادة 2%) ورسوم البنك للترتيب والتقييم. وتضيف هذه مجتمعة من 6% إلى 8% فوق الدفعة الأولى.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('Can I include fees in the mortgage?', 'هل يمكن إضافة الرسوم إلى التمويل؟'),
        a: L('No. Banks lend against the property value only, so fees are paid in cash.', 'لا. تموّل البنوك على قيمة العقار فقط، لذا تُدفع الرسوم نقدًا.'),
      },
    ],
    law: L('UAE Central Bank mortgage regulations; Dubai Land Department fees', 'أنظمة المصرف المركزي للتمويل العقاري؛ رسوم دائرة الأراضي والأملاك في دبي'),
    related: ['loan-emi', 'salary', 'uae-vat'],
  },

  {
    slug: 'salary-converter/',
    calc: 'salary',
    group: 'money',
    title: L('Salary Converter', 'محوّل الراتب'),
    metaTitle: L('Salary Converter – Monthly, Yearly, Daily and Hourly Pay', 'محوّل الراتب – شهري وسنوي ويومي وبالساعة'),
    description: L(
      'Convert pay between hourly, daily, weekly, monthly and yearly in AED, SAR, QAR, OMR, BHD or KWD.',
      'حوّل الأجر بين الساعة واليوم والأسبوع والشهر والسنة بالدرهم أو الريال أو الدينار.',
    ),
    card: L('Hourly ↔ daily ↔ monthly ↔ yearly.', 'بالساعة ↔ يومي ↔ شهري ↔ سنوي.'),
    keywords: L('salary converter hourly monthly annual wage', 'تحويل راتب شهري سنوي بالساعة'),
    intro: L(
      'Compare job offers or work out your hourly rate. Set your working days and hours for an exact figure.',
      'قارن عروض العمل أو احسب أجرك بالساعة. حدد أيام وساعات عملك لنتيجة دقيقة.',
    ),
    how: [
      L('Yearly = monthly × 12', 'السنوي = الشهري × 12'),
      L('Weekly = yearly ÷ 52', 'الأسبوعي = السنوي ÷ 52'),
      L('Daily = weekly ÷ working days', 'اليومي = الأسبوعي ÷ أيام العمل'),
      L('Hourly = daily ÷ working hours', 'بالساعة = اليومي ÷ ساعات العمل'),
    ],
    guide: [
      {
        h: L('Comparing offers in the Gulf', 'مقارنة العروض في الخليج'),
        p: [
          L(
            'Gulf salaries are usually quoted per month and split into basic pay and allowances. When comparing offers, look at the total package and at the basic salary separately, because gratuity, overtime and leave encashment are all worked out on basic pay.',
            'تُعرض الرواتب في الخليج عادة شهريًا وتُقسَّم إلى أساسي وبدلات. عند مقارنة العروض انظر إلى الحزمة الكاملة وإلى الراتب الأساسي كلٌ على حدة، لأن المكافأة والعمل الإضافي وبدل الإجازة تُحسب كلها على الأساسي.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('Why does my daily rate differ from basic ÷ 30?', 'لماذا يختلف أجري اليومي عن الأساسي ÷ 30؟'),
        a: L(
          'Labour law uses ÷ 30 for calendar days. This converter divides by working days, which gives the pay for each day you actually work.',
          'يستخدم قانون العمل القسمة على 30 للأيام التقويمية، بينما يقسم هذا المحوّل على أيام العمل الفعلية فيعطي أجر كل يوم تعمل فيه.',
        ),
      },
    ],
    law: L('General calculation; no specific law', 'حساب عام؛ لا يستند إلى قانون محدد'),
    related: ['uae-overtime', 'loan-emi', 'uae-gratuity'],
  },

  {
    slug: 'saudi/end-of-service-calculator/',
    calc: 'saudi',
    group: 'gcc',
    title: L('Saudi Arabia End of Service Calculator', 'حاسبة مكافأة نهاية الخدمة في السعودية'),
    metaTitle: L('Saudi End of Service Award Calculator 2026 – Resignation and Termination', 'حاسبة مكافأة نهاية الخدمة في السعودية 2026'),
    description: L(
      'Calculate the Saudi end-of-service award: half a month\'s wage per year for 5 years, a full month after, with the resignation reductions in Article 85.',
      'احسب مكافأة نهاية الخدمة في السعودية: نصف شهر عن كل سنة لأول 5 سنوات وشهر كامل بعدها، مع تخفيضات الاستقالة في المادة 85.',
    ),
    card: L('Half a month per year for 5 years, then a month. Resignation shares.', 'نصف شهر عن كل سنة لـ 5 سنوات ثم شهر. ونسب الاستقالة.'),
    keywords: L('saudi ksa end of service award eosb resignation', 'السعودية مكافأة نهاية الخدمة استقالة'),
    intro: L(
      'Private-sector workers in Saudi Arabia earn an end-of-service award. The amount depends on your last wage, your service and whether you resigned.',
      'يستحق العاملون في القطاع الخاص بالسعودية مكافأة نهاية الخدمة، ويعتمد مبلغها على آخر أجر ومدة الخدمة وما إذا كنت قد استقلت.',
    ),
    how: [
      L('First 5 years: half a month\'s wage per year', 'أول 5 سنوات: نصف أجر شهر عن كل سنة'),
      L('After 5 years: a month\'s wage per year', 'بعد 5 سنوات: أجر شهر عن كل سنة'),
      L('Resigned after 2–5 years: one third', 'استقالة بعد 2–5 سنوات: الثلث'),
      L('Resigned after 5–10 years: two thirds', 'استقالة بعد 5–10 سنوات: الثلثان'),
      L('Resigned after 10+ years: full amount', 'استقالة بعد 10 سنوات فأكثر: كاملة'),
    ],
    guide: [
      {
        h: L('How the award is calculated', 'كيف تُحسب المكافأة'),
        p: [
          L(
            'Article 84 of the Saudi Labor Law gives half a month\'s wage for each of the first five years and a full month\'s wage for each year after, based on the last wage. In Saudi Arabia this usually means the actual wage: basic pay plus housing and other fixed allowances. Part years count in proportion.',
            'تمنح المادة 84 من نظام العمل السعودي أجر نصف شهر عن كل سنة من السنوات الخمس الأولى، وأجر شهر عن كل سنة بعدها، على أساس آخر أجر. ويُقصد به عادة الأجر الفعلي: الأساسي مع بدل السكن والبدلات الثابتة الأخرى. وتُحتسب أجزاء السنة بنسبتها.',
          ),
        ],
      },
      {
        h: L('If you resign', 'في حال الاستقالة'),
        p: [
          L(
            'Article 85 reduces the award when you resign: nothing under 2 years, one third from 2 to 5 years, two thirds from 5 to 10 years, and the full award after 10 years. Under Article 87 you still get the full award if you leave because of force majeure, or if you are a woman who resigns within 6 months of marriage or 3 months of giving birth.',
            'تُخفض المادة 85 المكافأة عند الاستقالة: لا شيء قبل سنتين، والثلث من سنتين إلى 5 سنوات، والثلثان من 5 إلى 10 سنوات، وكاملة بعد 10 سنوات. ووفق المادة 87 تستحق المكافأة كاملة إذا تركت العمل لقوة قاهرة، أو إذا كانت العاملة قد استقالت خلال 6 أشهر من الزواج أو 3 أشهر من الوضع.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('Is housing allowance included?', 'هل يدخل بدل السكن؟'),
        a: L('Usually yes. The award is based on the actual wage, which includes fixed allowances.', 'عادة نعم. تُحسب المكافأة على الأجر الفعلي الذي يشمل البدلات الثابتة.'),
      },
      {
        q: L('What if the employer ends my contract?', 'ماذا لو أنهى صاحب العمل عقدي؟'),
        a: L('You receive the full award with no reduction.', 'تحصل على المكافأة كاملة دون تخفيض.'),
      },
    ],
    law: L('Saudi Labor Law, Articles 84, 85 and 87', 'نظام العمل السعودي، المواد 84 و85 و87'),
    related: ['qatar', 'kuwait', 'uae-gratuity'],
  },

  {
    slug: 'qatar/end-of-service-calculator/',
    calc: 'qatar',
    group: 'gcc',
    title: L('Qatar End of Service Gratuity Calculator', 'حاسبة مكافأة نهاية الخدمة في قطر'),
    metaTitle: L('Qatar Gratuity Calculator 2026 – 3 Weeks per Year', 'حاسبة مكافأة نهاية الخدمة في قطر 2026'),
    description: L(
      'Calculate end-of-service gratuity in Qatar: at least 3 weeks of basic wage for each year of service after the first year.',
      'احسب مكافأة نهاية الخدمة في قطر: ما لا يقل عن أجر 3 أسابيع أساسي عن كل سنة خدمة بعد السنة الأولى.',
    ),
    card: L('At least 3 weeks of basic wage per year.', 'أجر 3 أسابيع أساسي على الأقل عن كل سنة.'),
    keywords: L('qatar doha gratuity end of service', 'قطر الدوحة مكافأة نهاية الخدمة'),
    intro: L(
      'Workers in Qatar who complete a year of service are owed gratuity of at least 3 weeks\' basic wage for every year worked.',
      'يستحق العاملون في قطر بعد إتمام سنة خدمة مكافأة لا تقل عن أجر 3 أسابيع أساسي عن كل سنة عمل.',
    ),
    how: [
      L('Daily wage = basic ÷ 30', 'الأجر اليومي = الأساسي ÷ 30'),
      L('21 days\' wage for each year', 'أجر 21 يومًا عن كل سنة'),
      L('Part years count in proportion', 'تُحتسب أجزاء السنة بنسبتها'),
      L('Nothing under 1 year', 'لا مكافأة قبل سنة'),
    ],
    guide: [
      {
        h: L('The Qatar rule', 'القاعدة في قطر'),
        p: [
          L(
            'Article 54 of Labour Law No. 14 of 2004 sets the minimum gratuity at 3 weeks\' basic wage for each year of service, once you have completed a year. Your contract can give more. Resigning does not reduce the minimum. Since 2020 workers can change jobs without employer permission, and gratuity is still due when they do.',
            'تحدد المادة 54 من قانون العمل رقم 14 لسنة 2004 الحد الأدنى للمكافأة بأجر 3 أسابيع أساسي عن كل سنة خدمة بعد إتمام سنة. ويمكن أن يمنحك العقد أكثر. ولا تُنقص الاستقالة الحد الأدنى. ومنذ 2020 يمكن للعمال تغيير وظائفهم دون إذن صاحب العمل، وتبقى المكافأة مستحقة عند ذلك.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('Does Qatar include allowances?', 'هل تدخل البدلات في قطر؟'),
        a: L('No. The legal minimum uses the basic wage.', 'لا. يُحسب الحد الأدنى القانوني على الأجر الأساسي.'),
      },
    ],
    law: L('Qatar Labour Law No. 14 of 2004, Article 54', 'قانون العمل القطري رقم 14 لسنة 2004، المادة 54'),
    related: ['saudi', 'oman', 'uae-gratuity'],
  },

  {
    slug: 'oman/end-of-service-calculator/',
    calc: 'oman',
    group: 'gcc',
    title: L('Oman End of Service Gratuity Calculator', 'حاسبة مكافأة نهاية الخدمة في عُمان'),
    metaTitle: L('Oman Gratuity Calculator 2026 – New Labour Law', 'حاسبة مكافأة نهاية الخدمة في عُمان 2026'),
    description: L(
      'Calculate end-of-service gratuity for non-Omani workers: one month of basic wage for each year of service under the 2023 Labour Law.',
      'احسب مكافأة نهاية الخدمة للعامل غير العماني: أجر شهر أساسي عن كل سنة خدمة وفق قانون العمل لعام 2023.',
    ),
    card: L('One month of basic wage per year for non-Omanis.', 'أجر شهر أساسي عن كل سنة لغير العمانيين.'),
    keywords: L('oman muscat gratuity end of service', 'عمان مسقط مكافأة نهاية الخدمة'),
    intro: L(
      'Non-Omani workers in the private sector earn one month of basic wage for each year of service under the 2023 Labour Law.',
      'يستحق العامل غير العماني في القطاع الخاص أجر شهر أساسي عن كل سنة خدمة وفق قانون العمل لعام 2023.',
    ),
    how: [
      L('One month\'s basic wage for each year', 'أجر شهر أساسي عن كل سنة'),
      L('Based on the last basic wage', 'على أساس آخر أجر أساسي'),
      L('Part years count in proportion', 'تُحتسب أجزاء السنة بنسبتها'),
    ],
    guide: [
      {
        h: L('What changed in 2023', 'ما الذي تغيّر في 2023'),
        p: [
          L(
            'The Labour Law issued by Royal Decree 53/2023 raised gratuity for non-Omanis to at least one month\'s basic wage for every year of service, from the first year. Under the old law it was 15 days a year for the first 3 years.',
            'رفع قانون العمل الصادر بالمرسوم السلطاني 53/2023 مكافأة غير العمانيين إلى أجر شهر أساسي على الأقل عن كل سنة خدمة من السنة الأولى، بعد أن كانت 15 يومًا عن كل سنة من أول 3 سنوات في القانون السابق.',
          ),
        ],
      },
      {
        h: L('The new savings fund', 'صندوق الادخار الجديد'),
        p: [
          L(
            'The Social Protection Law (Royal Decree 52/2023) is replacing the lump sum for non-Omanis with a savings fund that employers pay into each month. Service before the fund starts is still paid as gratuity by the employer. Ask your employer whether contributions have started for you.',
            'يحل قانون الحماية الاجتماعية (المرسوم السلطاني 52/2023) محل المبلغ المقطوع لغير العمانيين بصندوق ادخار يدفع فيه صاحب العمل اشتراكًا شهريًا. وتبقى الخدمة السابقة لبدء الصندوق مستحقة كمكافأة يدفعها صاحب العمل. اسأل صاحب العمل هل بدأت الاشتراكات عنك.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('Do Omani nationals get gratuity?', 'هل يحصل العمانيون على مكافأة نهاية الخدمة؟'),
        a: L('Omani nationals are covered by the social insurance system instead.', 'يخضع العمانيون لنظام التأمينات الاجتماعية بدلًا من ذلك.'),
      },
    ],
    law: L('Oman Labour Law (Royal Decree 53/2023); Social Protection Law (Royal Decree 52/2023)', 'قانون العمل العماني (المرسوم السلطاني 53/2023)؛ قانون الحماية الاجتماعية (المرسوم السلطاني 52/2023)'),
    related: ['qatar', 'bahrain', 'uae-gratuity'],
  },

  {
    slug: 'bahrain/end-of-service-calculator/',
    calc: 'bahrain',
    group: 'gcc',
    title: L('Bahrain End of Service Calculator', 'حاسبة مكافأة نهاية الخدمة في البحرين'),
    metaTitle: L('Bahrain End of Service Calculator – SIO System from 2024', 'حاسبة مكافأة نهاية الخدمة في البحرين – نظام الهيئة 2024'),
    description: L(
      'Estimate end-of-service benefits in Bahrain: the employer-paid part before March 2024 and the SIO part at 4.2% or 8.4% of monthly wage since.',
      'قدّر مكافأة نهاية الخدمة في البحرين: الجزء الذي يدفعه صاحب العمل قبل مارس 2024، والجزء الذي تدفعه الهيئة بنسبة 4.2% أو 8.4% منذ ذلك الحين.',
    ),
    card: L('Employer part before March 2024, SIO part after.', 'جزء صاحب العمل قبل مارس 2024 وجزء الهيئة بعده.'),
    keywords: L('bahrain manama sio end of service gratuity', 'البحرين المنامة الهيئة مكافأة'),
    intro: L(
      'Since 1 March 2024, end-of-service benefits for expatriate workers in Bahrain are paid by the Social Insurance Organization (SIO). Service before then is still paid by your employer.',
      'منذ 1 مارس 2024 تصرف الهيئة العامة للتأمين الاجتماعي مكافأة نهاية الخدمة للعمال الأجانب في البحرين، وتبقى الخدمة السابقة لذلك على صاحب العمل.',
    ),
    how: [
      L('Before 1 March 2024: half a month per year for 3 years, then a month', 'قبل 1 مارس 2024: نصف شهر عن كل سنة لـ 3 سنوات ثم شهر'),
      L('From 1 March 2024: employer pays SIO 4.2% of monthly wage', 'من 1 مارس 2024: يدفع صاحب العمل للهيئة 4.2% من الأجر الشهري'),
      L('After 3 years of service: 8.4%', 'بعد 3 سنوات خدمة: 8.4%'),
    ],
    guide: [
      {
        h: L('The SIO system', 'نظام الهيئة'),
        p: [
          L(
            'Edict 109 of 2023 moved expatriate end-of-service benefits to the SIO from 1 March 2024. Your employer pays SIO a monthly contribution of 4.2% of your wage for the first 3 years and 8.4% after that. When you leave, you apply to SIO for the benefit, and SIO pays you directly.',
            'نقل القرار 109 لسنة 2023 مكافأة نهاية الخدمة للعمال الأجانب إلى الهيئة العامة للتأمين الاجتماعي اعتبارًا من 1 مارس 2024. يدفع صاحب العمل للهيئة اشتراكًا شهريًا بنسبة 4.2% من أجرك في أول 3 سنوات و8.4% بعدها. وعند ترك العمل تتقدم بطلب إلى الهيئة لتصرف لك المكافأة مباشرة.',
          ),
          L(
            'The rates match the old formula in Article 116 of Labour Law No. 36 of 2012: half a month\'s wage per year for 3 years (about 4.2% a month) and a month\'s wage per year after (about 8.4%).',
            'وتتطابق النسب مع الصيغة السابقة في المادة 116 من قانون العمل رقم 36 لسنة 2012: نصف أجر شهر عن كل سنة لـ 3 سنوات (نحو 4.2% شهريًا) وأجر شهر عن كل سنة بعدها (نحو 8.4%).',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('Who pays for my service before March 2024?', 'من يدفع عن خدمتي قبل مارس 2024؟'),
        a: L('Your employer, under the old rules, when your employment ends.', 'صاحب العمل، وفق النظام السابق، عند انتهاء خدمتك.'),
      },
    ],
    law: L('Bahrain Labour Law No. 36 of 2012, Article 116; Edict 109 of 2023', 'قانون العمل البحريني رقم 36 لسنة 2012، المادة 116؛ القرار 109 لسنة 2023'),
    related: ['kuwait', 'oman', 'saudi'],
  },

  {
    slug: 'kuwait/end-of-service-calculator/',
    calc: 'kuwait',
    group: 'gcc',
    title: L('Kuwait Indemnity Calculator', 'حاسبة مكافأة نهاية الخدمة في الكويت'),
    metaTitle: L('Kuwait Indemnity Calculator 2026 – End of Service', 'حاسبة مكافأة نهاية الخدمة في الكويت 2026'),
    description: L(
      'Calculate end-of-service indemnity in Kuwait: 15 days per year for 5 years, a month after, capped at 18 months, with resignation reductions.',
      'احسب مكافأة نهاية الخدمة في الكويت: 15 يومًا عن كل سنة لـ 5 سنوات ثم شهر، بحد أقصى أجر 18 شهرًا، مع تخفيضات الاستقالة.',
    ),
    card: L('15 days per year for 5 years, then a month. Max 18 months.', '15 يومًا عن كل سنة لـ 5 سنوات ثم شهر. الحد 18 شهرًا.'),
    keywords: L('kuwait indemnity end of service gratuity resignation', 'الكويت مكافأة نهاية الخدمة استقالة'),
    intro: L(
      'Private-sector workers in Kuwait earn an end-of-service indemnity after a year of service. Resigning reduces it unless you have served 10 years.',
      'يستحق العاملون في القطاع الخاص بالكويت مكافأة نهاية الخدمة بعد سنة خدمة، وتُخفَّض عند الاستقالة ما لم تتم 10 سنوات.',
    ),
    how: [
      L('First 5 years: 15 days\' wage per year', 'أول 5 سنوات: أجر 15 يومًا عن كل سنة'),
      L('After 5 years: a month\'s wage per year', 'بعد 5 سنوات: أجر شهر عن كل سنة'),
      L('Daily wage = monthly ÷ 26 working days', 'الأجر اليومي = الشهري ÷ 26 يوم عمل'),
      L('Maximum: 18 months\' wage', 'الحد الأقصى: أجر 18 شهرًا'),
      L('Resigned: 0 under 3 years, ½ to 5, ⅔ to 10, full after', 'الاستقالة: لا شيء قبل 3 سنوات، النصف حتى 5، الثلثان حتى 10، كاملة بعدها'),
    ],
    guide: [
      {
        h: L('How the indemnity works', 'كيف تعمل المكافأة'),
        p: [
          L(
            'Article 51 of Law No. 6 of 2010 gives monthly-paid workers 15 days\' wage for each of the first five years and a month\'s wage for each year after, up to 18 months in total. Kuwait uses the full wage, meaning basic pay plus regular allowances, and the daily wage is the monthly wage divided by working days.',
            'تمنح المادة 51 من القانون رقم 6 لسنة 2010 أصحاب الأجر الشهري أجر 15 يومًا عن كل سنة من السنوات الخمس الأولى، وأجر شهر عن كل سنة بعدها، بحد أقصى 18 شهرًا. وتعتمد الكويت الأجر الكامل أي الأساسي مع البدلات الدورية، والأجر اليومي هو الأجر الشهري مقسومًا على أيام العمل.',
          ),
          L(
            'Under Article 53, a worker who resigns gets nothing under 3 years of service, half from 3 to 5 years, two thirds from 5 to 10 years, and the full amount after 10 years.',
            'ووفق المادة 53 لا يستحق العامل المستقيل شيئًا قبل 3 سنوات خدمة، ويستحق النصف من 3 إلى 5 سنوات، والثلثين من 5 إلى 10 سنوات، والمكافأة كاملة بعد 10 سنوات.',
          ),
        ],
      },
    ],
    faq: [
      {
        q: L('Are daily-paid workers different?', 'هل يختلف حساب أصحاب الأجر اليومي؟'),
        a: L('Yes. Daily, weekly and hourly paid workers earn 10 days per year for the first 5 years. This calculator is for monthly-paid workers.', 'نعم. يستحق أصحاب الأجر اليومي والأسبوعي وبالساعة 10 أيام عن كل سنة لأول 5 سنوات. هذه الحاسبة لأصحاب الأجر الشهري.'),
      },
    ],
    law: L('Kuwait Labour Law No. 6 of 2010, Articles 51, 53, 55 and 67', 'قانون العمل الكويتي رقم 6 لسنة 2010، المواد 51 و53 و55 و67'),
    related: ['saudi', 'bahrain', 'qatar'],
  },
];

export const GROUP_ORDER = ['uae-eos', 'uae-pay', 'money', 'gcc'];

export function pageByCalc(calc) {
  return PAGES.find((p) => p.calc === calc);
}
