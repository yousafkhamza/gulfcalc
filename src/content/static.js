// About, privacy, terms and contact pages. `sections` are { h, p: [] } in both languages.
const L = (en, ar) => ({ en, ar });

export function staticPages({ repoUrl, checked }) {
  return [
    {
      slug: 'about/',
      key: 'about',
      title: L('About gulfcalc', 'عن gulfcalc'),
      description: L(
        'gulfcalc offers free, private salary and end-of-service calculators for the UAE and the GCC, based on the current labour laws.',
        'يقدم gulfcalc حاسبات مجانية وخاصة للرواتب ونهاية الخدمة في الإمارات ودول الخليج وفق قوانين العمل السارية.',
      ),
      sections: [
        {
          h: L('Why this site exists', 'لماذا هذا الموقع'),
          p: [
            L(
              'Working out gratuity or a final settlement should not need a lawyer or a spreadsheet. gulfcalc turns the rules in the UAE and GCC labour laws into simple calculators that show their working, so employees and HR teams can check the numbers for themselves.',
              'لا ينبغي أن يحتاج حساب المكافأة أو التسوية النهائية إلى محامٍ أو جدول بيانات. يحوّل gulfcalc قواعد قوانين العمل في الإمارات ودول الخليج إلى حاسبات بسيطة تعرض طريقة الحساب، ليتحقق الموظفون وفرق الموارد البشرية من الأرقام بأنفسهم.',
            ),
          ],
        },
        {
          h: L('How the rules are kept current', 'كيف نحافظ على تحديث القواعد'),
          p: [
            L(
              `Each calculator names the law and article it follows. The rules were last checked on ${checked.en}. When a law changes, the calculator, its tests and its guide are updated together.`,
              `تذكر كل حاسبة القانون والمادة التي تستند إليها. آخر مراجعة للقواعد كانت في ${checked.ar}. وعند تغيّر أي قانون نحدّث الحاسبة واختباراتها ودليلها معًا.`,
            ),
            L(
              'Results are estimates. Contracts, company policies and court decisions can lead to different figures, so always confirm the final amount with your employer or the labour ministry.',
              'النتائج تقديرية، وقد تؤدي العقود وسياسات الشركات وأحكام المحاكم إلى أرقام مختلفة، لذا تأكد دائمًا من المبلغ النهائي مع صاحب العمل أو وزارة العمل.',
            ),
          ],
        },
        {
          h: L('Open source', 'مفتوح المصدر'),
          p: [
            L(
              `The full source code and every formula are public at ${repoUrl}. You can read how each number is calculated and report a problem there.`,
              `الشيفرة المصدرية وكل المعادلات متاحة للعموم على ${repoUrl}. يمكنك قراءة طريقة حساب كل رقم والإبلاغ عن أي مشكلة هناك.`,
            ),
          ],
        },
      ],
    },
    {
      slug: 'privacy/',
      key: 'privacy',
      title: L('Privacy policy', 'سياسة الخصوصية'),
      description: L('How gulfcalc handles your data: calculations stay in your browser, and what cookies may be used.', 'كيف يتعامل gulfcalc مع بياناتك: تبقى الحسابات في متصفحك، وما ملفات تعريف الارتباط التي قد تُستخدم.'),
      sections: [
        {
          h: L('The numbers you enter', 'الأرقام التي تدخلها'),
          p: [
            L(
              'All calculations run in your browser. Your salary, dates and other inputs are never sent to us or stored on a server. If you use "Copy result link", your inputs are placed in the link itself, so only people you share the link with can see them.',
              'تتم كل العمليات الحسابية في متصفحك، ولا تُرسل أرقام راتبك أو التواريخ أو أي مدخلات أخرى إلينا ولا تُخزَّن على أي خادم. وعند استخدام "نسخ رابط النتيجة" توضع مدخلاتك داخل الرابط نفسه، فلا يراها إلا من تشارك الرابط معه.',
            ),
          ],
        },
        {
          h: L('Stored on your device', 'ما يُحفظ على جهازك'),
          p: [
            L(
              'We store your colour theme choice in your browser\'s local storage. A service worker keeps a copy of the pages so the site works offline. You can clear both from your browser settings.',
              'نحفظ اختيارك لنمط الألوان في التخزين المحلي لمتصفحك، ويحتفظ عامل الخدمة بنسخة من الصفحات ليعمل الموقع دون اتصال. ويمكنك مسح الاثنين من إعدادات المتصفح.',
            ),
          ],
        },
        {
          h: L('Hosting and fonts', 'الاستضافة والخطوط'),
          p: [
            L(
              'The site is hosted on GitHub Pages, which may log your IP address for security. Fonts are loaded from Google Fonts. See the GitHub and Google privacy policies for details.',
              'يستضيف GitHub Pages الموقع وقد يسجل عنوان IP لأغراض الأمان. وتُحمَّل الخطوط من Google Fonts. راجع سياسات الخصوصية لدى GitHub وGoogle للتفاصيل.',
            ),
          ],
        },
        {
          h: L('Advertising', 'الإعلانات'),
          p: [
            L(
              'This site may show ads from Google AdSense. Google and its partners use cookies to show ads based on your visits to this and other sites. You can turn off personalised ads at adssettings.google.com. Visitors in the EEA, the UK and Switzerland are asked for consent before these cookies are used. Learn more at policies.google.com/technologies/ads.',
              'قد يعرض هذا الموقع إعلانات من Google AdSense. تستخدم Google وشركاؤها ملفات تعريف الارتباط لعرض إعلانات بناءً على زياراتك لهذا الموقع ومواقع أخرى. يمكنك إيقاف الإعلانات المخصصة من adssettings.google.com. ويُطلب من الزوار في المنطقة الاقتصادية الأوروبية والمملكة المتحدة وسويسرا الموافقة قبل استخدام هذه الملفات. اعرف المزيد على policies.google.com/technologies/ads.',
            ),
          ],
        },
        {
          h: L('Changes', 'التغييرات'),
          p: [L(`This policy was last updated on ${checked.en}.`, `آخر تحديث لهذه السياسة كان في ${checked.ar}.`)],
        },
      ],
    },
    {
      slug: 'terms/',
      key: 'terms',
      title: L('Terms of use', 'شروط الاستخدام'),
      description: L(
        'The terms for using the free gulfcalc salary and end-of-service calculators, and the limits of their estimates.',
        'شروط استخدام حاسبات gulfcalc المجانية للرواتب ونهاية الخدمة، وحدود المسؤولية عن نتائجها التقديرية.',
      ),
      sections: [
        {
          h: L('Estimates only', 'نتائج تقديرية فقط'),
          p: [
            L(
              'The calculators give estimates based on the laws named on each page. They are not legal, financial or tax advice. Your contract, your employer\'s policies or a court may give a different result.',
              'تقدم الحاسبات نتائج تقديرية وفق القوانين المذكورة في كل صفحة، وهي ليست استشارة قانونية أو مالية أو ضريبية. وقد يؤدي عقدك أو سياسات صاحب العمل أو حكم المحكمة إلى نتيجة مختلفة.',
            ),
          ],
        },
        {
          h: L('No warranty', 'دون ضمان'),
          p: [
            L(
              'The site is provided as is. We work to keep it accurate and current but do not guarantee that it is free of errors. We are not liable for decisions made using its results.',
              'يُقدَّم الموقع كما هو. نعمل على إبقائه دقيقًا ومحدثًا لكننا لا نضمن خلوه من الأخطاء، ولا نتحمل مسؤولية القرارات المتخذة بناءً على نتائجه.',
            ),
          ],
        },
        {
          h: L('Using the content', 'استخدام المحتوى'),
          p: [
            L(
              'The source code is open source under the MIT licence. You may link to any page and share result links freely.',
              'الشيفرة المصدرية مفتوحة المصدر بموجب ترخيص MIT. ويمكنك الربط بأي صفحة ومشاركة روابط النتائج بحرية.',
            ),
          ],
        },
      ],
    },
    {
      slug: 'contact/',
      key: 'contact',
      title: L('Contact', 'تواصل معنا'),
      description: L(
        'Report a problem with a calculator or suggest a new one for gulfcalc.',
        'أبلغ عن مشكلة في إحدى الحاسبات أو اقترح حاسبة جديدة لموقع gulfcalc.',
      ),
      sections: [
        {
          h: L('Report a problem or suggest a calculator', 'أبلغ عن مشكلة أو اقترح حاسبة'),
          p: [
            L(
              `Open an issue at ${repoUrl}/issues. Tell us which calculator, the numbers you entered and what you expected. Please do not post personal details such as your name or employer.`,
              `افتح طلبًا على ${repoUrl}/issues. أخبرنا بالحاسبة والأرقام التي أدخلتها وما توقعته. يُرجى عدم نشر بيانات شخصية مثل اسمك أو اسم صاحب العمل.`,
            ),
          ],
        },
        {
          h: L('Labour disputes', 'النزاعات العمالية'),
          p: [
            L(
              'We cannot help with individual disputes. In the UAE, contact MOHRE on 600 590000 or through the MOHRE app. In other GCC countries, contact the labour ministry.',
              'لا يمكننا المساعدة في النزاعات الفردية. في الإمارات تواصل مع وزارة الموارد البشرية والتوطين على 600590000 أو عبر تطبيقها. وفي دول الخليج الأخرى تواصل مع وزارة العمل.',
            ),
          ],
        },
      ],
    },
  ];
}
