// Calculator definitions: form fields + how results are laid out. Shared by build and browser.
import { bahrainEndOfService, gccEndOfService, RULES } from './lib/gcc.js';
import { finalSettlement, leaveEntitlement, leaveSalary, noticePeriod, overtime } from './lib/pay.js';
import { amortisation, convertSalary, flatLoan, loanEmi, mortgage, vat } from './lib/money.js';
import { difcDews, federalGovGratuity, uaeGratuity } from './lib/uae.js';

const L = (en, ar) => ({ en, ar });

const CUR_AR = { AED: 'درهم', SAR: 'ريال سعودي', QAR: 'ريال قطري', OMR: 'ريال عماني', BHD: 'دينار بحريني', KWD: 'دينار كويتي' };

const DAYS = L('days', 'يوم');
const HOURS = L('hours', 'ساعة');
const MONTHS = L('months', 'شهر');

function spanText(span) {
  return L(
    `${span.y} years, ${span.m} months, ${span.d} days`,
    `السنوات: ${span.y} · الأشهر: ${span.m} · الأيام: ${span.d}`,
  );
}

const field = {
  basic: (cur = 'AED', def = 8000) => ({
    id: 'basic',
    type: 'number',
    min: 0,
    step: cur === 'AED' || cur === 'SAR' || cur === 'QAR' ? 100 : 10,
    default: def,
    label: L(`Basic monthly salary (${cur})`, `الراتب الأساسي الشهري (${CUR_AR[cur]})`),
    hint: L('Basic only, without housing or transport allowance', 'الأساسي فقط، دون بدل السكن أو المواصلات'),
  }),
  wage: (cur, def, hint) => ({
    id: 'wage',
    type: 'number',
    min: 0,
    step: 10,
    default: def,
    label: L(`Last monthly wage (${cur})`, `آخر أجر شهري (${CUR_AR[cur]})`),
    hint,
  }),
  start: (def = '2019-03-01') => ({ id: 'start', type: 'date', default: def, label: L('Joining date', 'تاريخ الالتحاق') }),
  end: (def = '2026-11-30') => ({ id: 'end', type: 'date', default: def, label: L('Last working day', 'آخر يوم عمل') }),
  unpaid: () => ({
    id: 'unpaid',
    type: 'number',
    min: 0,
    step: 1,
    default: 0,
    label: L('Unpaid leave days', 'أيام الإجازة غير المدفوعة'),
    hint: L('These days are not counted as service', 'لا تُحتسب ضمن مدة الخدمة'),
  }),
  dayBasis: () => ({
    id: 'dayBasis',
    type: 'select',
    default: '30',
    label: L('Daily wage method', 'طريقة حساب الأجر اليومي'),
    hint: L('Most employers use basic ÷ 30', 'يعتمد أغلب أصحاب العمل الأساسي ÷ 30'),
    options: [
      { value: '30', label: L('Basic ÷ 30 (most common)', 'الأساسي ÷ 30 (الأكثر شيوعًا)') },
      { value: '365', label: L('Basic × 12 ÷ 365', 'الأساسي × 12 ÷ 365') },
    ],
  }),
  reason: () => ({
    id: 'reason',
    type: 'select',
    default: 'ended',
    label: L('How the job ended', 'سبب انتهاء العمل'),
    options: [
      { value: 'ended', label: L('Employer ended it or contract expired', 'إنهاء من صاحب العمل أو انتهاء العقد') },
      { value: 'resigned', label: L('I resigned', 'استقالة') },
    ],
  }),
  currency: (def = 'AED') => ({
    id: 'currency',
    type: 'select',
    default: def,
    label: L('Currency', 'العملة'),
    options: Object.keys(CUR_AR).map((c) => ({ value: c, label: L(c, CUR_AR[c]) })),
  }),
};

const dateError = { error: 'dates' };

function uaePrivateSpec({ notes }) {
  return {
    currency: 'AED',
    fields: [field.basic(), field.start(), field.end(), field.unpaid(), field.dayBasis()],
    compute(v) {
      const r = uaeGratuity({ basic: v.basic, start: v.start, end: v.end, unpaidDays: v.unpaid, dayBasis: Number(v.dayBasis) });
      if (r.error) return dateError;
      return {
        label: L('Your estimated gratuity', 'مكافأة نهاية الخدمة التقديرية'),
        big: { money: r.total },
        badge: !r.eligible
          ? { tone: 'warn', text: L('Less than 1 year of service, so no gratuity is due.', 'الخدمة أقل من سنة، لذلك لا تستحق مكافأة.') }
          : r.capped
            ? { tone: 'info', text: L('The 2-year maximum applies to your gratuity.', 'تم تطبيق الحد الأقصى: أجر سنتين.') }
            : null,
        rows: [
          { label: L('Service', 'مدة الخدمة'), value: { text: spanText(r.span) } },
          { label: L('Unpaid leave deducted', 'الإجازة غير المدفوعة المخصومة'), value: { num: r.unpaid, digits: 0, unit: DAYS } },
          { label: L('Years counted', 'السنوات المحتسبة'), value: { num: r.years, digits: 3 } },
          { label: L('Daily basic wage', 'الأجر اليومي الأساسي'), value: { money: r.daily } },
          { label: L('First 5 years × 21 days', 'أول 5 سنوات × 21 يومًا'), value: { money: r.first } },
          { label: L('After 5 years × 30 days', 'ما بعد 5 سنوات × 30 يومًا'), value: { money: r.after } },
          { label: L('Maximum (2 years of basic salary)', 'الحد الأقصى (أجر سنتين)'), value: { money: r.cap } },
        ],
        notes,
      };
    },
  };
}

export const CALCS = {
  'uae-gratuity': uaePrivateSpec({
    notes: [
      L(
        'Based on Article 51 of Federal Decree-Law No. 33 of 2021. Resigning does not reduce gratuity under this law.',
        'وفق المادة 51 من المرسوم بقانون اتحادي رقم 33 لسنة 2021. الاستقالة لا تُنقص المكافأة وفق هذا القانون.',
      ),
    ],
  }),

  'uae-freezone': uaePrivateSpec({
    notes: [
      L(
        'JAFZA, DMCC, DAFZA, DSO, RAKEZ and most other free zones follow the federal formula. DIFC and ADGM have their own rules.',
        'تتبع جافزا ومركز دبي للسلع المتعددة وداف زا وواحة دبي للسيليكون وراكز ومعظم المناطق الحرة الصيغة الاتحادية. لمركز دبي المالي العالمي وسوق أبوظبي العالمي قواعد خاصة.',
      ),
    ],
  }),

  'uae-difc': {
    currency: 'AED',
    fields: [
      field.basic('AED', 20000),
      field.start('2017-06-01'),
      field.end(),
      {
        id: 'annualReturn',
        type: 'number',
        min: 0,
        max: 20,
        step: 0.5,
        default: 0,
        label: L('Assumed yearly investment return (%)', 'العائد السنوي المفترض للاستثمار (%)'),
        hint: L('Use 0 to see contributions only', 'اختر 0 لعرض الاشتراكات فقط'),
      },
    ],
    compute(v) {
      const r = difcDews({ basic: v.basic, start: v.start, end: v.end, annualReturn: v.annualReturn });
      if (r.error) return dateError;
      return {
        label: L('Estimated total at exit', 'الإجمالي التقديري عند انتهاء الخدمة'),
        big: { money: r.total },
        badge: !r.eligible
          ? { tone: 'warn', text: L('Under 1 year of service: no gratuity for the period before 2020.', 'خدمة أقل من سنة: لا مكافأة عن الفترة قبل 2020.') }
          : null,
        rows: [
          { label: L('Service', 'مدة الخدمة'), value: { text: spanText(r.span) } },
          { label: L('Service before 1 Feb 2020', 'الخدمة قبل 1 فبراير 2020'), value: { num: r.legacyYears, digits: 3, unit: L('years', 'سنة') } },
          { label: L('Gratuity for that period (paid by employer)', 'مكافأة تلك الفترة (يدفعها صاحب العمل)'), value: { money: r.legacy } },
          { label: L('Months in DEWS', 'الأشهر في برنامج DEWS'), value: { num: r.months, digits: 1, unit: MONTHS } },
          { label: L('DEWS contributions', 'اشتراكات DEWS'), value: { money: r.contributions } },
          { label: L('Investment growth (assumed)', 'نمو الاستثمار (مفترض)'), value: { money: r.growth } },
          { label: L('DEWS balance', 'رصيد DEWS'), value: { money: r.balance }, strong: true },
        ],
        notes: [
          L(
            'DEWS rates: 5.83% of monthly basic salary for the first 5 years of service, 8.33% after. Contributions use your basic salary each month; this estimate uses one salary for all months.',
            'نسب DEWS: ‏5.83% من الراتب الأساسي الشهري في أول 5 سنوات خدمة، و8.33% بعدها. تُحتسب الاشتراكات على راتبك الأساسي في كل شهر، وهذا التقدير يستخدم راتبًا واحدًا لكل الأشهر.',
          ),
        ],
      };
    },
  },

  'uae-government': {
    currency: 'AED',
    fields: [
      field.basic('AED', 15000),
      field.start('2018-09-01'),
      field.end(),
      { id: 'notice', type: 'number', min: 0, step: 1, default: 30, label: L('Notice period (days)', 'مدة الإنذار (أيام)') },
      {
        id: 'unusedLeave',
        type: 'number',
        min: 0,
        step: 1,
        default: 0,
        label: L('Unused leave days', 'أيام الإجازة غير المستخدمة'),
        hint: L('Counted as service under Article 41', 'تُحتسب ضمن مدة الخدمة وفق المادة 41'),
      },
    ],
    compute(v) {
      const r = federalGovGratuity({ basic: v.basic, start: v.start, end: v.end, noticeDays: v.notice, unusedLeaveDays: v.unusedLeave });
      if (r.error) return dateError;
      return {
        label: L('Your estimated gratuity', 'مكافأة نهاية الخدمة التقديرية'),
        big: { money: r.total },
        badge: !r.eligible
          ? { tone: 'warn', text: L('Less than 1 continuous year of service, so no gratuity is due.', 'الخدمة أقل من سنة متصلة، لذلك لا تستحق مكافأة.') }
          : null,
        rows: [
          { label: L('Actual service', 'مدة الخدمة الفعلية'), value: { text: spanText(r.span) } },
          { label: L('Notice + unused leave added', 'الإنذار والإجازة المضافة'), value: { num: r.extra, digits: 0, unit: DAYS } },
          { label: L('Months counted (part month = full month)', 'الأشهر المحتسبة (جزء الشهر = شهر كامل)'), value: { num: r.months, digits: 0, unit: MONTHS } },
          { label: L('Daily basic salary (÷ 30)', 'الراتب الأساسي اليومي (÷ 30)'), value: { money: r.daily } },
          { label: L('First 5 years × 21 days', 'أول 5 سنوات × 21 يومًا'), value: { money: r.first } },
          { label: L('After 5 years × 30 days', 'ما بعد 5 سنوات × 30 يومًا'), value: { money: r.after } },
        ],
        notes: [
          L(
            'Federal Decree-Law No. 49 of 2022, Article 41, in force from 2 January 2023. Service before that date may follow your entity\'s earlier rules (Article 42). UAE nationals receive a pension instead.',
            'المرسوم بقانون اتحادي رقم 49 لسنة 2022، المادة 41، النافذ من 2 يناير 2023. قد تخضع الخدمة السابقة لهذا التاريخ للأنظمة السابقة في جهتك (المادة 42). يحصل المواطنون على معاش تقاعدي بدلًا من ذلك.',
          ),
        ],
      };
    },
  },

  'uae-leave': {
    currency: 'AED',
    fields: [
      field.basic('AED', 8000),
      {
        id: 'housing',
        type: 'number',
        min: 0,
        step: 100,
        default: 3000,
        label: L('Housing allowance per month (AED)', 'بدل السكن الشهري (درهم)'),
      },
      { id: 'days', type: 'number', min: 0, max: 365, step: 1, default: 30, label: L('Leave days', 'أيام الإجازة') },
      {
        id: 'mode',
        type: 'select',
        default: 'leave',
        label: L('What are the days for?', 'ما نوع هذه الأيام؟'),
        options: [
          { value: 'leave', label: L('Taking annual leave', 'إجازة سنوية سأتمتع بها') },
          { value: 'encash', label: L('Unused days paid when leaving the job', 'أيام غير مستخدمة تُصرف عند ترك العمل') },
        ],
      },
      {
        id: 'service',
        type: 'number',
        min: 0,
        step: 1,
        default: 24,
        label: L('Months of service', 'أشهر الخدمة'),
        hint: L('Used to show how many days you earn a year', 'لمعرفة عدد أيام الإجازة المستحقة سنويًا'),
      },
    ],
    compute(v) {
      const r = leaveSalary({ basic: v.basic, housing: v.housing, days: v.days, mode: v.mode });
      const yearly = leaveEntitlement(v.service);
      return {
        label: v.mode === 'encash' ? L('Leave encashment', 'بدل الإجازة غير المستخدمة') : L('Leave salary', 'راتب الإجازة'),
        big: { money: r.total },
        rows: [
          {
            label: L('Pay per day', 'الأجر عن اليوم'),
            value: { money: r.perDay },
          },
          {
            label: L('Based on', 'يُحسب على أساس'),
            value: {
              text: v.mode === 'encash' ? L('Basic salary ÷ 30', 'الراتب الأساسي ÷ 30') : L('(Basic + housing) ÷ 30', '(الأساسي + السكن) ÷ 30'),
            },
          },
          { label: L('Days', 'الأيام'), value: { num: r.days, digits: 0, unit: DAYS } },
          { label: L('Your yearly entitlement', 'استحقاقك السنوي'), value: { num: yearly, digits: 0, unit: DAYS } },
        ],
        notes: [
          L(
            'Article 29 of Decree-Law 33/2021: 2 days per month after 6 months of service, 30 days a year after the first year.',
            'المادة 29 من المرسوم بقانون 33/2021: يومان عن كل شهر بعد 6 أشهر خدمة، و30 يومًا سنويًا بعد السنة الأولى.',
          ),
        ],
      };
    },
  },

  'uae-overtime': {
    currency: 'AED',
    fields: [
      field.basic('AED', 6000),
      { id: 'normal', type: 'number', min: 0, step: 0.5, default: 10, label: L('Normal overtime hours (+25%)', 'ساعات إضافية عادية (+25%)') },
      { id: 'night', type: 'number', min: 0, step: 0.5, default: 4, label: L('Hours between 10 pm and 4 am (+50%)', 'ساعات بين 10 مساءً و4 صباحًا (+50%)') },
      { id: 'rest', type: 'number', min: 0, step: 0.5, default: 0, label: L('Hours on your rest day (+50%)', 'ساعات في يوم الراحة (+50%)') },
      { id: 'holiday', type: 'number', min: 0, step: 0.5, default: 0, label: L('Hours on a public holiday (+50%)', 'ساعات في عطلة رسمية (+50%)') },
    ],
    compute(v) {
      const r = overtime(v);
      return {
        label: L('Overtime pay', 'أجر العمل الإضافي'),
        big: { money: r.total },
        badge:
          r.hours > 144
            ? { tone: 'warn', text: L('More than 144 overtime hours in 3 weeks is over the legal limit.', 'أكثر من 144 ساعة إضافية خلال 3 أسابيع يتجاوز الحد القانوني.') }
            : null,
        rows: [
          { label: L('Hourly basic wage (basic ÷ 30 ÷ 8)', 'الأجر الأساسي للساعة (الأساسي ÷ 30 ÷ 8)'), value: { money: r.hourly } },
          { label: L('Normal overtime', 'العمل الإضافي العادي'), value: { money: r.parts.normal } },
          { label: L('Night overtime', 'العمل الإضافي الليلي'), value: { money: r.parts.night } },
          { label: L('Rest day', 'يوم الراحة'), value: { money: r.parts.rest } },
          { label: L('Public holiday', 'العطلة الرسمية'), value: { money: r.parts.holiday } },
          { label: L('Total hours', 'إجمالي الساعات'), value: { num: r.hours, digits: 1, unit: HOURS } },
        ],
        notes: [
          L(
            'Article 19 of Decree-Law 33/2021. Rest day and holiday hours earn +50% only when the employer does not give another day off instead. Shift workers are paid +25% for night hours.',
            'المادة 19 من المرسوم بقانون 33/2021. تُستحق زيادة 50% عن ساعات يوم الراحة والعطلة فقط إذا لم يمنحك صاحب العمل يومًا بديلًا. عمال المناوبات يحصلون على 25% عن ساعات الليل.',
          ),
        ],
      };
    },
  },

  'uae-notice': {
    currency: 'AED',
    fields: [
      { id: 'noticeDate', type: 'date', default: '2026-12-01', label: L('Date notice is given', 'تاريخ تقديم الإنذار') },
      {
        id: 'days',
        type: 'select',
        default: '30',
        label: L('Notice period in your contract', 'مدة الإنذار في عقدك'),
        options: [
          { value: '30', label: L('30 days', '30 يومًا') },
          { value: '45', label: L('45 days', '45 يومًا') },
          { value: '60', label: L('60 days', '60 يومًا') },
          { value: '90', label: L('90 days', '90 يومًا') },
        ],
      },
      {
        id: 'monthly',
        type: 'number',
        min: 0,
        step: 100,
        default: 12000,
        label: L('Total monthly salary (AED)', 'إجمالي الراتب الشهري (درهم)'),
        hint: L('Basic plus all allowances, for pay in lieu of notice', 'الأساسي مع كل البدلات، لحساب بدل الإنذار'),
      },
    ],
    compute(v) {
      const r = noticePeriod({ noticeDate: v.noticeDate, days: Number(v.days), monthly: v.monthly });
      if (r.error) return dateError;
      return {
        label: L('Last working day', 'آخر يوم عمل'),
        big: { date: r.lastDay },
        rows: [
          { label: L('Notice period', 'مدة الإنذار'), value: { num: r.days, digits: 0, unit: DAYS } },
          { label: L('Pay per day (total ÷ 30)', 'الأجر اليومي (الإجمالي ÷ 30)'), value: { money: r.perDay } },
          { label: L('Pay in lieu of the full notice', 'بدل الإنذار كاملًا'), value: { money: r.payInLieu }, strong: true },
        ],
        notes: [
          L(
            'Article 43 of Decree-Law 33/2021: notice must be at least 30 days and at most 90 days. The day notice is given counts as day 1 here.',
            'المادة 43 من المرسوم بقانون 33/2021: مدة الإنذار لا تقل عن 30 يومًا ولا تزيد على 90 يومًا. احتسبنا يوم تقديم الإنذار يومًا أول.',
          ),
        ],
      };
    },
  },

  'uae-settlement': {
    currency: 'AED',
    fields: [
      field.basic('AED', 8000),
      { id: 'monthly', type: 'number', min: 0, step: 100, default: 12000, label: L('Total monthly salary (AED)', 'إجمالي الراتب الشهري (درهم)'), hint: L('Basic plus all allowances', 'الأساسي مع كل البدلات') },
      field.start(),
      field.end(),
      { id: 'unusedLeave', type: 'number', min: 0, step: 1, default: 12, label: L('Unused annual leave days', 'أيام الإجازة السنوية غير المستخدمة') },
      { id: 'salaryDays', type: 'number', min: 0, step: 1, default: 30, label: L('Days of salary not yet paid', 'أيام راتب لم تُدفع بعد') },
      { id: 'noticeDays', type: 'number', min: 0, step: 1, default: 0, label: L('Notice days paid instead of worked', 'أيام إنذار تُدفع بدل العمل') },
      { id: 'other', type: 'number', min: 0, step: 100, default: 0, label: L('Other amounts owed to you (AED)', 'مبالغ أخرى مستحقة لك (درهم)'), hint: L('For example a ticket allowance or bonus', 'مثل بدل تذكرة السفر أو مكافأة') },
      { id: 'deductions', type: 'number', min: 0, step: 100, default: 0, label: L('Deductions (AED)', 'الاستقطاعات (درهم)'), hint: L('For example a salary advance or loan', 'مثل سلفة على الراتب أو قرض') },
      field.unpaid(),
    ],
    compute(v) {
      const r = finalSettlement({
        basic: v.basic,
        monthly: v.monthly,
        start: v.start,
        end: v.end,
        unpaidLeaveDays: v.unpaid,
        unusedLeaveDays: v.unusedLeave,
        salaryDays: v.salaryDays,
        noticeDays: v.noticeDays,
        other: v.other,
        deductions: v.deductions,
      });
      if (r.error) return dateError;
      return {
        label: L('Estimated final settlement', 'التسوية النهائية التقديرية'),
        big: { money: r.total },
        rows: [
          { label: L('Gratuity', 'مكافأة نهاية الخدمة'), value: { money: r.gratuity.total } },
          { label: L('Unused leave (basic ÷ 30)', 'الإجازة غير المستخدمة (الأساسي ÷ 30)'), value: { money: r.leave } },
          { label: L('Unpaid salary (total ÷ 30)', 'الراتب غير المدفوع (الإجمالي ÷ 30)'), value: { money: r.salary } },
          { label: L('Notice pay', 'بدل الإنذار'), value: { money: r.notice } },
          { label: L('Other amounts', 'مبالغ أخرى'), value: { money: r.other } },
          { label: L('Deductions', 'الاستقطاعات'), value: { money: -r.deductions } },
        ],
        notes: [
          L(
            'The employer must pay all dues within 14 days of the contract ending (Article 53 of Decree-Law 33/2021).',
            'يجب على صاحب العمل سداد جميع المستحقات خلال 14 يومًا من انتهاء العقد (المادة 53 من المرسوم بقانون 33/2021).',
          ),
        ],
      };
    },
  },

  'uae-vat': {
    currency: 'AED',
    fields: [
      { id: 'amount', type: 'number', min: 0, step: 0.01, default: 1000, label: L('Amount (AED)', 'المبلغ (درهم)') },
      {
        id: 'mode',
        type: 'select',
        default: 'add',
        label: L('What do you want to do?', 'ماذا تريد أن تفعل؟'),
        options: [
          { value: 'add', label: L('Add 5% VAT to a price', 'إضافة ضريبة 5% إلى السعر') },
          { value: 'remove', label: L('Remove VAT from a price that includes it', 'استخراج الضريبة من سعر شامل لها') },
        ],
      },
    ],
    compute(v) {
      const r = vat({ amount: v.amount, mode: v.mode });
      return {
        label: v.mode === 'remove' ? L('Price before VAT', 'السعر قبل الضريبة') : L('Price with VAT', 'السعر شامل الضريبة'),
        big: { money: v.mode === 'remove' ? r.net : r.gross },
        rows: [
          { label: L('Net amount', 'المبلغ الصافي'), value: { money: r.net } },
          { label: L('VAT at 5%', 'ضريبة القيمة المضافة 5%'), value: { money: r.vat } },
          { label: L('Total with VAT', 'الإجمالي شامل الضريبة'), value: { money: r.gross }, strong: true },
        ],
        notes: [L('UAE standard VAT rate is 5% (Federal Decree-Law No. 8 of 2017).', 'نسبة ضريبة القيمة المضافة القياسية في الإمارات 5% (المرسوم بقانون اتحادي رقم 8 لسنة 2017).')],
      };
    },
  },

  'loan-emi': {
    currency: (v) => v.currency,
    fields: [
      field.currency('AED'),
      { id: 'amount', type: 'number', min: 0, step: 1000, default: 80000, label: L('Loan amount', 'مبلغ القرض') },
      { id: 'rate', type: 'number', min: 0, max: 60, step: 0.01, default: 3.5, label: L('Interest rate per year (%)', 'نسبة الفائدة السنوية (%)') },
      { id: 'years', type: 'number', min: 0.5, max: 30, step: 0.5, default: 4, label: L('Loan term (years)', 'مدة القرض (سنوات)') },
      {
        id: 'rateType',
        type: 'select',
        default: 'flat',
        label: L('Rate type', 'نوع الفائدة'),
        hint: L('Car and personal loans in the Gulf are often quoted as flat', 'غالبًا ما تُعرض قروض السيارات والقروض الشخصية بفائدة ثابتة'),
        options: [
          { value: 'flat', label: L('Flat rate', 'فائدة ثابتة') },
          { value: 'reducing', label: L('Reducing balance', 'رصيد متناقص') },
        ],
      },
    ],
    compute(v) {
      const n = Math.round(v.years * 12);
      if (v.rateType === 'flat') {
        const r = flatLoan(v.amount, v.rate, n);
        return {
          label: L('Monthly payment', 'القسط الشهري'),
          big: { money: r.emi },
          rows: [
            { label: L('Number of payments', 'عدد الأقساط'), value: { num: r.months, digits: 0 } },
            { label: L('Total interest', 'إجمالي الفائدة'), value: { money: r.interest } },
            { label: L('Total you pay', 'إجمالي ما تدفعه'), value: { money: r.total }, strong: true },
            { label: L('Same as a reducing rate of', 'تعادل فائدة متناقصة بنسبة'), value: { pct: r.effectiveRate } },
          ],
          notes: [
            L(
              'A flat rate charges interest on the full amount for the whole term, so it costs almost twice what the same reducing rate would.',
              'الفائدة الثابتة تُحتسب على كامل المبلغ طوال المدة، لذا تكلف تقريبًا ضعف الفائدة المتناقصة بالنسبة نفسها.',
            ),
          ],
        };
      }
      const r = loanEmi(v.amount, v.rate, n);
      const schedule = amortisation(v.amount, v.rate, n);
      return {
        label: L('Monthly payment', 'القسط الشهري'),
        big: { money: r.emi },
        rows: [
          { label: L('Number of payments', 'عدد الأقساط'), value: { num: r.months, digits: 0 } },
          { label: L('Total interest', 'إجمالي الفائدة'), value: { money: r.interest } },
          { label: L('Total you pay', 'إجمالي ما تدفعه'), value: { money: r.total }, strong: true },
        ],
        table: {
          head: [L('Year', 'السنة'), L('Principal paid', 'المسدد من الأصل'), L('Interest paid', 'الفائدة المدفوعة'), L('Balance left', 'الرصيد المتبقي')],
          rows: schedule.map((y) => [{ num: y.year, digits: 0 }, { money: y.principal }, { money: y.interest }, { money: y.balance }]),
        },
      };
    },
  },

  'uae-mortgage': {
    currency: 'AED',
    fields: [
      { id: 'price', type: 'number', min: 0, step: 10000, default: 1500000, label: L('Property price (AED)', 'سعر العقار (درهم)') },
      { id: 'downPct', type: 'number', min: 0, max: 100, step: 1, default: 20, label: L('Down payment (%)', 'الدفعة المقدمة (%)') },
      { id: 'rate', type: 'number', min: 0, max: 20, step: 0.01, default: 4.25, label: L('Interest rate per year (%)', 'نسبة الفائدة السنوية (%)') },
      { id: 'years', type: 'number', min: 1, max: 25, step: 1, default: 25, label: L('Term (years, max 25)', 'المدة (سنوات، 25 كحد أقصى)') },
      {
        id: 'buyer',
        type: 'select',
        default: 'expat',
        label: L('Buyer', 'المشتري'),
        options: [
          { value: 'expat', label: L('Expat resident, first home', 'مقيم وافد، أول منزل') },
          { value: 'national', label: L('UAE national, first home', 'مواطن إماراتي، أول منزل') },
        ],
      },
      { id: 'agentPct', type: 'number', min: 0, max: 5, step: 0.5, default: 2, label: L('Agent fee (%)', 'عمولة الوسيط (%)'), hint: L('Use 0 if buying directly from the developer', 'اختر 0 عند الشراء من المطور مباشرة') },
    ],
    compute(v) {
      const r = mortgage(v);
      return {
        label: L('Monthly payment', 'القسط الشهري'),
        big: { money: r.emi },
        badge: r.belowMinimum
          ? {
              tone: 'warn',
              text: L(
                `Banks need at least ${r.minDownPct}% down for this purchase.`,
                `تشترط البنوك دفعة مقدمة لا تقل عن ${r.minDownPct}% لهذا الشراء.`,
              ),
            }
          : null,
        rows: [
          { label: L('Loan amount', 'مبلغ القرض'), value: { money: r.loan } },
          { label: L('Down payment', 'الدفعة المقدمة'), value: { money: r.down } },
          { label: L('DLD transfer fee (4% + AED 580)', 'رسوم دائرة الأراضي (4% + 580 درهم)'), value: { money: r.fees.dld } },
          { label: L('Mortgage registration (0.25% + AED 290)', 'تسجيل الرهن (0.25% + 290 درهم)'), value: { money: r.fees.registration } },
          { label: L('Trustee office fee + VAT', 'رسوم أمين التسجيل + الضريبة'), value: { money: r.fees.trustee } },
          { label: L('Agent fee + VAT', 'عمولة الوسيط + الضريبة'), value: { money: r.fees.agent } },
          { label: L('Bank arrangement fee (1% + VAT)', 'رسوم ترتيب التمويل (1% + الضريبة)'), value: { money: r.fees.bank } },
          { label: L('Valuation', 'رسوم التقييم'), value: { money: r.fees.valuation } },
          { label: L('Cash needed upfront', 'النقد المطلوب مقدمًا'), value: { money: r.upfront }, strong: true },
          { label: L('Total interest over the term', 'إجمالي الفائدة طوال المدة'), value: { money: r.interest } },
        ],
        notes: [
          L(
            'Fees are typical Dubai figures. Abu Dhabi and other emirates charge different transfer fees. Check the final amounts with your bank and the trustee office.',
            'الرسوم تقديرية وفق المعتاد في دبي. تختلف رسوم النقل في أبوظبي والإمارات الأخرى. تأكد من المبالغ النهائية مع البنك ومكتب أمين التسجيل.',
          ),
        ],
      };
    },
  },

  salary: {
    currency: (v) => v.currency,
    fields: [
      field.currency('AED'),
      { id: 'amount', type: 'number', min: 0, step: 100, default: 15000, label: L('Amount', 'المبلغ') },
      {
        id: 'period',
        type: 'select',
        default: 'month',
        label: L('Paid per', 'يُدفع عن كل'),
        options: [
          { value: 'hour', label: L('Hour', 'ساعة') },
          { value: 'day', label: L('Day', 'يوم') },
          { value: 'week', label: L('Week', 'أسبوع') },
          { value: 'month', label: L('Month', 'شهر') },
          { value: 'year', label: L('Year', 'سنة') },
        ],
      },
      { id: 'daysPerWeek', type: 'number', min: 1, max: 7, step: 0.5, default: 5, label: L('Working days per week', 'أيام العمل في الأسبوع') },
      { id: 'hoursPerDay', type: 'number', min: 1, max: 24, step: 0.5, default: 8, label: L('Working hours per day', 'ساعات العمل في اليوم') },
    ],
    compute(v) {
      const r = convertSalary(v);
      return {
        label: L('Yearly pay', 'الأجر السنوي'),
        big: { money: r.yearly },
        rows: [
          { label: L('Monthly', 'شهريًا'), value: { money: r.monthly } },
          { label: L('Weekly', 'أسبوعيًا'), value: { money: r.weekly } },
          { label: L('Daily', 'يوميًا'), value: { money: r.daily } },
          { label: L('Hourly', 'بالساعة'), value: { money: r.hourly } },
        ],
        notes: [L('Uses 52 weeks a year and the working days and hours you set.', 'يعتمد على 52 أسبوعًا في السنة وأيام وساعات العمل التي أدخلتها.')],
      };
    },
  },

  saudi: gccSpec('saudi', {
    wageHint: L('Basic plus housing and other fixed allowances', 'الأساسي مع بدل السكن والبدلات الثابتة الأخرى'),
    def: 9000,
    reason: true,
    notes: [
      L(
        'Saudi Labor Law, Articles 84 and 85. Resigning after 2 to 5 years pays one third, 5 to 10 years two thirds, 10 years or more the full amount.',
        'نظام العمل السعودي، المادتان 84 و85. عند الاستقالة: ثلث المكافأة بعد سنتين إلى 5 سنوات، وثلثاها من 5 إلى 10 سنوات، وكاملها بعد 10 سنوات.',
      ),
    ],
  }),

  qatar: gccSpec('qatar', {
    wageHint: L('Basic wage only', 'الأجر الأساسي فقط'),
    def: 8000,
    reason: false,
    notes: [
      L(
        'Qatar Labour Law No. 14 of 2004, Article 54: at least 3 weeks\' basic wage for each year of service, after 1 year. Your contract may give more.',
        'قانون العمل القطري رقم 14 لسنة 2004، المادة 54: ما لا يقل عن أجر 3 أسابيع أساسي عن كل سنة خدمة، بعد إتمام سنة. قد يمنحك عقدك أكثر.',
      ),
    ],
  }),

  oman: gccSpec('oman', {
    wageHint: L('Basic wage only', 'الأجر الأساسي فقط'),
    def: 800,
    reason: false,
    notes: [
      L(
        'Oman Labour Law (Royal Decree 53/2023): one month\'s basic wage per year for non-Omani workers. A savings fund under the Social Protection Law is replacing this for future service, so check which applies to you.',
        'قانون العمل العماني (المرسوم السلطاني 53/2023): أجر شهر أساسي عن كل سنة للعامل غير العماني. يحل صندوق ادخار وفق قانون الحماية الاجتماعية محل ذلك للخدمة المستقبلية، فتحقق مما ينطبق عليك.',
      ),
    ],
  }),

  kuwait: gccSpec('kuwait', {
    wageHint: L('Total wage: basic plus regular allowances', 'الأجر الكامل: الأساسي مع البدلات الدورية'),
    def: 600,
    reason: true,
    notes: [
      L(
        'Kuwait Law No. 6 of 2010, Articles 51 and 53, for monthly-paid workers. 15 days = 15/26 of a month. Maximum 18 months\' wage. Resigning pays nothing under 3 years, half from 3 to 5, two thirds from 5 to 10, full after 10.',
        'قانون العمل الكويتي رقم 6 لسنة 2010، المادتان 51 و53، لأصحاب الأجر الشهري. 15 يومًا = 15/26 من الشهر. الحد الأقصى أجر 18 شهرًا. عند الاستقالة: لا شيء قبل 3 سنوات، النصف من 3 إلى 5، الثلثان من 5 إلى 10، كاملة بعد 10.',
      ),
    ],
  }),

  bahrain: {
    currency: 'BHD',
    fields: [
      field.wage('BHD', 700, L('The monthly wage your employer uses for SIO', 'الأجر الشهري الذي يعتمده صاحب العمل لدى الهيئة')),
      field.start('2019-03-01'),
      field.end(),
    ],
    compute(v) {
      const r = bahrainEndOfService(v);
      if (r.error) return dateError;
      return {
        label: L('Estimated end-of-service benefit', 'مكافأة نهاية الخدمة التقديرية'),
        big: { money: r.total },
        rows: [
          { label: L('Service', 'مدة الخدمة'), value: { text: spanText(r.span) } },
          { label: L('Service before 1 March 2024', 'الخدمة قبل 1 مارس 2024'), value: { num: r.legacyYears, digits: 3, unit: L('years', 'سنة') } },
          { label: L('Paid by employer (old rules)', 'يدفعها صاحب العمل (النظام السابق)'), value: { money: r.legacy } },
          { label: L('Months under SIO', 'الأشهر لدى الهيئة'), value: { num: r.months, digits: 1, unit: MONTHS } },
          { label: L('Paid by SIO (4.2% / 8.4% a month)', 'تدفعها الهيئة (4.2% / 8.4% شهريًا)'), value: { money: r.sio } },
        ],
        notes: [
          L(
            'Labour Law No. 36 of 2012, Article 116: half a month\'s wage per year for the first 3 years, a month per year after. Since 1 March 2024 employers pay SIO each month and SIO pays you (Edict 109 of 2023).',
            'قانون العمل رقم 36 لسنة 2012، المادة 116: نصف أجر شهر عن كل سنة من أول 3 سنوات، وأجر شهر عن كل سنة بعدها. منذ 1 مارس 2024 يدفع صاحب العمل اشتراكًا شهريًا للهيئة العامة للتأمين الاجتماعي وهي التي تصرف لك المكافأة (القرار 109 لسنة 2023).',
          ),
        ],
      };
    },
  },
};

function gccSpec(country, { wageHint, def, reason, notes }) {
  const rule = RULES[country];
  const fields = [field.wage(rule.currency, def, wageHint), field.start(), field.end()];
  if (reason) fields.push(field.reason());
  return {
    currency: rule.currency,
    fields,
    compute(v) {
      const r = gccEndOfService(country, { wage: v.wage, start: v.start, end: v.end, reason: v.reason ?? 'ended' });
      if (r.error) return dateError;
      const rows = [
        { label: L('Service', 'مدة الخدمة'), value: { text: spanText(r.span) } },
        { label: L('Years counted', 'السنوات المحتسبة'), value: { num: r.years, digits: 3 } },
      ];
      rule.tiers.forEach((tier, i) => {
        const part = r.parts[i];
        if (!part) return;
        const top = tier.upTo === Infinity ? null : tier.upTo;
        const from = i === 0 ? 0 : rule.tiers[i - 1].upTo;
        const label =
          top === null
            ? from === 0
              ? L('Every year of service', 'كل سنة خدمة')
              : L(`After year ${from}`, `بعد السنة ${from}`)
            : L(`Years 1 to ${top}`, `من السنة 1 إلى ${top}`);
        rows.push({ label, value: { money: r.eligible ? part.amount : 0 } });
      });
      if (r.cap !== null) rows.push({ label: L('Maximum', 'الحد الأقصى'), value: { money: r.cap } });
      if (reason) rows.push({ label: L('Share paid after resigning', 'النسبة المستحقة عند الاستقالة'), value: { pct: (v.reason === 'resigned' ? r.share : 1) * 100, digits: 1 } });
      return {
        label: L('Estimated end-of-service benefit', 'مكافأة نهاية الخدمة التقديرية'),
        big: { money: r.total },
        badge: !r.eligible
          ? { tone: 'warn', text: L(`Less than ${rule.minYears} year of service, so nothing is due.`, `الخدمة أقل من ${rule.minYears} سنة، لذلك لا تستحق مكافأة.`) }
          : r.capped
            ? { tone: 'info', text: L('The legal maximum applies.', 'تم تطبيق الحد الأقصى القانوني.') }
            : v.reason === 'resigned' && r.share < 1
              ? { tone: 'info', text: L('Reduced because you resigned.', 'تم التخفيض بسبب الاستقالة.') }
              : null,
        rows,
        notes,
      };
    },
  };
}

export const CALC_IDS = Object.keys(CALCS);
