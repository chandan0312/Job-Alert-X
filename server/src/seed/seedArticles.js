// ---------------------------------------------------------------------------
// Seed sample articles for Job Alert X
// ---------------------------------------------------------------------------

import { initDb, Article } from '../models/index.js'
import { closeDatabase } from '../config/db.js'

export const seedArticlesData = [
  {
    id: 'how-to-apply-ssc-cgl-2026-online-form-guide',
    title: 'How to Apply for SSC CGL 2026: Step-by-Step Online Registration & Form Filling Guide',
    slug: 'how-to-apply-ssc-cgl-2026-online-form-guide',
    category: 'how-to-apply',
    excerpt: 'Complete walkthrough on SSC One-Time Registration (OTR), filling post preferences, uploading live webcam photos according to new SSC guidelines, and avoiding application rejection.',
    author: 'Job Alert X Editorial Team',
    authorRole: 'Senior SSC Exam Specialist',
    readTime: '6 min read',
    tags: ['SSC CGL', 'How to Apply', 'OTR Portal', 'Online Form', 'Live Photo Guidelines'],
    status: 'published',
    featured: true,
    views: 18420,
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    metaTitle: 'How to Apply for SSC CGL 2026 — Step-by-Step Registration Guide',
    metaDescription: 'Step-by-step tutorial on applying for SSC Combined Graduate Level (CGL) 2026 online form on the new ssc.gov.in portal.',
    content: `
      <div class="article-body space-y-6">
        <p class="text-lg leading-relaxed font-medium text-slate-700 dark:text-slate-200">
          The Staff Selection Commission (SSC) conducts the Combined Graduate Level (CGL) examination to recruit officers for Group 'B' and 'C' posts across central ministries and departments. With the launch of the new <strong>ssc.gov.in</strong> portal, the application procedure has undergone critical changes—most notably the requirement of <em>live webcam photograph capture</em>.
        </p>

        <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
          <strong>⚠️ Crucial Update:</strong> Old SSC registration numbers from ssc.nic.in are no longer valid. Every candidate must complete fresh One-Time Registration (OTR) on ssc.gov.in before filling the SSC CGL application form.
        </div>

        <h2 class="text-2xl font-bold mt-8 mb-4">Step 1: One-Time Registration (OTR) on the New Portal</h2>
        <p>Before proceeding with the actual exam form, follow these steps to generate your lifelong Registration ID:</p>
        <ol class="list-decimal pl-6 space-y-2">
          <li>Visit the official portal at <strong>ssc.gov.in</strong> and click on <strong>"Register Now"</strong>.</li>
          <li>Enter your Aadhaar Card number or alternate valid photo ID (Voter ID, PAN, Driving License).</li>
          <li>Provide your Name, Father's Name, Mother's Name, and Date of Birth exactly as printed on your Class 10 (Matriculation) certificate.</li>
          <li>Enter your active Mobile Number and Email ID to receive verification OTPs.</li>
          <li>Set a secure password adhering to SSC password complexity rules.</li>
        </ol>

        <h2 class="text-2xl font-bold mt-8 mb-4">Step 2: Live Photograph & Signature Capture Rules</h2>
        <p>SSC has completely eliminated pre-scanned passport photograph uploads. Make sure you follow these guidelines strictly to prevent automatic rejection:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Good Lighting:</strong> Stand or sit in front of a white or light-colored plain wall. Avoid shadows on the face.</li>
          <li><strong>No Accessories:</strong> Do not wear caps, spectacles/glasses, earphones, or masks during the live capture.</li>
          <li><strong>Camera Alignment:</strong> Ensure your eyes are directly facing the camera at eye level.</li>
          <li><strong>Signature:</strong> Upload a scanned signature in JPG/JPEG format (10 KB to 20 KB) on clear white paper with black or blue ink.</li>
        </ul>

        <h2 class="text-2xl font-bold mt-8 mb-4">Step 3: Selecting Examination Centers & Post Preferences</h2>
        <p>Choose 3 examination centers within the same SSC Region in order of priority. Post preferences (such as Assistant Section Officer in MEA, Inspector in GST/Customs, Enforcement Officer in ED) are now finalized during the Tier-2 stage or final option cum preference window.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">Step 4: Application Fee & Confirmation Printout</h2>
        <p>The application fee is <strong>₹100</strong> for General/OBC/EWS male candidates. Women, SC, ST, PwBD, and Ex-Servicemen are exempt from payment. Always save a copy of the final submitted PDF and note the Application Sequence Number for future reference.</p>
      </div>
    `,
  },
  {
    id: 'how-to-download-rrb-admit-card-city-intimation-slip',
    title: 'How to Download Railway RRB Admit Card & Exam City Intimation Slip',
    slug: 'how-to-download-rrb-admit-card-city-intimation-slip',
    category: 'how-to-download',
    excerpt: 'Step-by-step guide to download your Railway Recruitment Board (RRB) e-call letter, check exam city slip, and recover forgotten registration credentials.',
    author: 'Job Alert X Editorial Team',
    authorRole: 'Railways Recruitment Analyst',
    readTime: '5 min read',
    tags: ['Railway RRB', 'Admit Card', 'City Slip', 'Hall Ticket', 'Download Guide'],
    status: 'published',
    featured: false,
    views: 12150,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    metaTitle: 'How to Download RRB Admit Card & City Slip — Step-by-Step',
    metaDescription: 'Learn how to download your RRB e-Call Letter and Exam City Intimation slip with direct links and instructions.',
    content: `
      <div class="article-body space-y-6">
        <p class="text-lg leading-relaxed font-medium text-slate-700 dark:text-slate-200">
          The Railway Recruitment Boards (RRB) release the <strong>Exam City and Date Intimation Slip</strong> roughly 10 days prior to the examination, followed by the official <strong>e-Call Letter (Admit Card)</strong> exactly 4 days before the test date.
        </p>

        <h2 class="text-2xl font-bold mt-8 mb-4">Quick Steps to Download Your E-Call Letter</h2>
        <ol class="list-decimal pl-6 space-y-3">
          <li>Visit your respective regional RRB portal (e.g., rrbcdg.gov.in for Chandigarh, rrbmumbai.gov.in for Mumbai).</li>
          <li>Locate the notification banner titled <em>"CBT e-Call Letter and City Intimation Slip Link"</em>.</li>
          <li>Enter your <strong>Registration Number</strong> and <strong>Date of Birth (DD/MM/YYYY)</strong> as password.</li>
          <li>Click <strong>"Login"</strong> to enter the candidate dashboard.</li>
          <li>Click the <strong>"City Intimation / E-Call Letter"</strong> tab and select <strong>"Download"</strong>.</li>
        </ol>

        <div class="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-blue-900 dark:text-blue-200">
          <strong>💡 Pro Tip:</strong> Always print the admit card on an A4 white sheet in color. Ensure the barcode, candidate roll number, and exam center code are crystal clear and unscratched.
        </div>

        <h2 class="text-2xl font-bold mt-8 mb-4">Forgot Your Registration Number? Here is How to Retrieve It</h2>
        <p>If you have misplaced your registration number, do not panic:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Click on the <strong>"Forgot Registration Number"</strong> link on the login page.</li>
          <li>Select the RRB region you applied for.</li>
          <li>Enter your Name, Date of Birth, registered Email ID or Mobile Number.</li>
          <li>The system will display or SMS your registration number instantly.</li>
        </ul>

        <h2 class="text-2xl font-bold mt-8 mb-4">Mandatory Items to Carry to RRB Exam Center</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>Printed RRB e-Call letter with self-declaration portion blank (fill it inside the exam lab).</li>
          <li>Original Aadhaar card or valid Govt photo ID (Photocopies are strictly forbidden).</li>
          <li>Two recent passport-size color photographs matching the application form.</li>
          <li>Transparent blue or black ballpoint pen.</li>
        </ul>
      </div>
    `,
  },
  {
    id: 'central-govt-jobs-document-verification-dv-checklist',
    title: 'Central Govt Jobs Document Verification (DV) Checklist: All Required Certificates & Rules',
    slug: 'central-govt-jobs-document-verification-dv-checklist',
    category: 'documentation',
    excerpt: 'Comprehensive checklist of certificates required during Document Verification for SSC, UPSC, Railways, and Bank exams, including crucial date rules for OBC-NCL, EWS, and SC/ST formats.',
    author: 'Job Alert X Editorial Team',
    authorRole: 'Civil Services & Documentation Consultant',
    readTime: '7 min read',
    tags: ['Document Verification', 'OBC-NCL', 'EWS Certificate', 'Crucial Date', 'Govt Job Checklist'],
    status: 'published',
    featured: true,
    views: 24390,
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    metaTitle: 'Govt Job Document Verification Checklist — Full Certificate Guide',
    metaDescription: 'Essential certificates and documents checklist for SSC, RRB, IBPS, and State PSC Document Verification stage.',
    content: `
      <div class="article-body space-y-6">
        <p class="text-lg leading-relaxed font-medium text-slate-700 dark:text-slate-200">
          Reaching the Document Verification (DV) stage is the final hurdle before your appointment letter is issued. However, every year hundreds of candidates are marked provisional or disqualified due to missing certificates, non-standard formats, or violating <strong>crucial date requirements</strong>.
        </p>

        <h2 class="text-2xl font-bold mt-8 mb-4">1. The Master DV Document Checklist</h2>
        <p>Prepare at least <strong>two sets of self-attested photocopies</strong> along with the original documents arranged in this exact order:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Matriculation (10th) Certificate & Marksheet:</strong> Serves as mandatory proof of Date of Birth and Father's/Mother's name.</li>
          <li><strong>Senior Secondary (12th) Certificate & Marksheet:</strong> Proof of intermediate qualification.</li>
          <li><strong>Graduation Degree & Semester-wise Marksheets:</strong> Final degree or provisional degree issued by UGC-recognized university.</li>
          <li><strong>Caste / Category Certificate:</strong> In Central Government prescribed format.</li>
          <li><strong>Valid Photo Identity Proof:</strong> Aadhaar Card, PAN Card, Voter Card, or Passport.</li>
          <li><strong>No Objection Certificate (NOC):</strong> For candidates currently serving in Central/State Government or PSU.</li>
          <li><strong>Passport Size Photos:</strong> At least 6-8 identical copies of recent photographs.</li>
        </ul>

        <h2 class="text-2xl font-bold mt-8 mb-4">2. Crucial Dates for Category Certificates</h2>
        <div class="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-900 dark:text-rose-200">
          <strong>Important Law:</strong> The "Crucial Date" for claim of SC/ST/OBC/EWS/PwBD status is normally the closing date for receipt of online applications unless explicitly stated otherwise in the notification.
        </div>

        <h3 class="text-xl font-semibold mt-4 mb-2">OBC-Non Creamy Layer (NCL)</h3>
        <p>Must be issued in the Central Government format (not state format). It must explicitly state that the candidate does not belong to the Creamy Layer based on the income of the past 3 financial years preceding the date of application.</p>

        <h3 class="text-xl font-semibold mt-4 mb-2">Economically Weaker Section (EWS)</h3>
        <p>The EWS certificate must mention the <strong>Financial Year</strong> (income basis) and the <strong>Validity Year</strong> (usually the financial year in which the application closed).</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">3. Minor Spelling Errors in Marksheets? Here is the Solution</h2>
        <p>If your father's or mother's name has a minor spelling discrepancy between the 10th marksheet and degree certificate, get a <strong>First Class Magistrate / Notary Affidavit</strong> drafted before the DV date explaining the discrepancy. This guarantees acceptance without disqualification.</p>
      </div>
    `,
  },
  {
    id: 'upsc-civil-services-prelims-6-month-strategy',
    title: 'UPSC Civil Services Prelims: 6-Month High-Yield Strategy & Subject-wise Plan',
    slug: 'upsc-civil-services-prelims-6-month-strategy',
    category: 'strategy',
    excerpt: 'Detailed roadmap for cracking UPSC CSE Prelims in 6 months, covering high-weightage static subjects, CSAT strategy, PYQ reverse engineering, and mock test analysis.',
    author: 'Job Alert X Editorial Team',
    authorRole: 'IAS/UPSC Strategy Mentor',
    readTime: '8 min read',
    tags: ['UPSC CSE', 'Prelims Strategy', 'IAS Exam', 'CSAT Prep', 'Study Plan'],
    status: 'published',
    featured: true,
    views: 31200,
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    metaTitle: 'UPSC Prelims 6-Month Strategy — High-Yield Subject-wise Roadmap',
    metaDescription: 'A disciplined 6-month study plan and revision strategy to clear UPSC Civil Services Prelims GS Paper 1 and CSAT.',
    content: `
      <div class="article-body space-y-6">
        <p class="text-lg leading-relaxed font-medium text-slate-700 dark:text-slate-200">
          The UPSC Civil Services Prelims is renowned for testing both depth of conceptual understanding and presence of mind under pressure. With changing question patterns (such as "Only one pair", "Only two pairs"), relying purely on elimination techniques is obsolete. You need a structured, high-yield subject-wise strategy.
        </p>

        <h2 class="text-2xl font-bold mt-8 mb-4">Phase 1 (Months 1–3): Solidify Core Static Pillars</h2>
        <p>More than 55-60 questions directly emerge from the core static subjects:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Indian Polity:</strong> Thoroughly read M. Laxmikanth with focus on Fundamental Rights, DPSP, Parliament, Judiciary, and Constitutional Bodies.</li>
          <li><strong>Modern History:</strong> Spectrum's Brief History of Modern India from the Revolt of 1857 up to Independence, with special focus on Governor-Generals and Congress sessions.</li>
          <li><strong>Economy:</strong> Conceptual clarity on Inflation, Monetary Policy, Banking, Balance of Payments, and Budget terms.</li>
          <li><strong>Geography & Environment:</strong> NCERTs Class 11-12 plus mapping (rivers, national parks, Ramsar sites, mountain passes).</li>
        </ul>

        <h2 class="text-2xl font-bold mt-8 mb-4">Phase 2 (Months 4–5): PYQ Reverse Engineering & Current Linkages</h2>
        <p>Analyze the last 10 years of UPSC Prelims question papers. Notice the recurring themes: Buddhism & Jainism, Preamble philosophy, ecological terms (carbon sequestration, blue carbon), and agricultural commodities.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">Phase 3 (Final Month): Mock Tests & CSAT Drills</h2>
        <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-900 dark:text-emerald-200">
          <strong>⚠️ Never Take CSAT for Granted:</strong> Allocate at least 90 minutes daily during the final 60 days to solve Reading Comprehension and Quant/Reasoning sets. Target scoring 90+ in mocks to safely clear the 66.67 cutoff mark.
        </div>
      </div>
    `,
  },
  {
    id: 'ssc-gd-constable-2026-syllabus-exam-pattern-breakdown',
    title: 'SSC GD Constable 2026 Detailed Syllabus & Exam Pattern Breakdown',
    slug: 'ssc-gd-constable-2026-syllabus-exam-pattern-breakdown',
    category: 'syllabus',
    excerpt: 'Detailed topic-wise syllabus, tier-1 computer based test pattern, marking scheme, and Physical Efficiency Test (PET/PST) criteria for SSC GD Constable.',
    author: 'Job Alert X Editorial Team',
    authorRole: 'Defence & Paramilitary Specialist',
    readTime: '5 min read',
    tags: ['SSC GD', 'Syllabus', 'Exam Pattern', 'Physical Test', 'Paramilitary'],
    status: 'published',
    featured: false,
    views: 9800,
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    metaTitle: 'SSC GD Constable Syllabus 2026 — Exam Pattern & Physical Test',
    metaDescription: 'Complete topic-wise syllabus, CBT marks distribution, and PET/PST requirements for SSC GD Constable recruitment.',
    content: `
      <div class="article-body space-y-6">
        <p class="text-lg leading-relaxed font-medium text-slate-700 dark:text-slate-200">
          The SSC GD Constable examination recruits soldiers for CAPFs (BSF, CISF, CRPF, SSB, ITBP, AR, and SSF). Understanding the exact CBT scheme and Physical Test thresholds is critical to scoring high marks.
        </p>

        <h2 class="text-2xl font-bold mt-8 mb-4">CBT Examination Pattern & Scheme</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left border border-slate-200 dark:border-slate-700">
            <thead class="bg-slate-100 dark:bg-slate-800 text-xs uppercase font-bold">
              <tr>
                <th class="p-3">Section</th>
                <th class="p-3">Questions</th>
                <th class="p-3">Max Marks</th>
                <th class="p-3">Duration</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr><td class="p-3 font-medium">Part A: General Intelligence & Reasoning</td><td class="p-3">20</td><td class="p-3">40</td><td class="p-3" rowspan="4">60 Minutes</td></tr>
              <tr><td class="p-3 font-medium">Part B: General Knowledge & General Awareness</td><td class="p-3">20</td><td class="p-3">40</td></tr>
              <tr><td class="p-3 font-medium">Part C: Elementary Mathematics</td><td class="p-3">20</td><td class="p-3">40</td></tr>
              <tr><td class="p-3 font-medium">Part D: English / Hindi</td><td class="p-3">20</td><td class="p-3">40</td></tr>
            </tbody>
          </table>
        </div>

        <h2 class="text-2xl font-bold mt-8 mb-4">Physical Efficiency Test (PET) Benchmarks</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Male Candidates:</strong> 5 km running in 24 minutes.</li>
          <li><strong>Female Candidates:</strong> 1.6 km running in 8½ minutes.</li>
          <li><strong>Height Requirements:</strong> Male: 170 cm, Female: 157 cm (Relaxation applicable for ST and Hill regions).</li>
        </ul>
      </div>
    `,
  },
  {
    id: 'how-normalization-cutoff-score-calculation-works-in-govt-exams',
    title: 'How Normalization & Cutoff Score Calculation Works in Govt Exams (With Formula)',
    slug: 'how-normalization-cutoff-score-calculation-works-in-govt-exams',
    category: 'result',
    excerpt: 'Demystifying the percentile and raw-to-normalized score calculation formulas used by SSC, Railways, and NTA across multi-shift examinations.',
    author: 'Job Alert X Editorial Team',
    authorRole: 'Examination Data & Analytics Lead',
    readTime: '6 min read',
    tags: ['Normalization', 'Result Cutoff', 'Percentile Score', 'Formula Breakdown', 'Exam Analysis'],
    status: 'published',
    featured: false,
    views: 14750,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    metaTitle: 'How Normalization Works in Govt Exams — Percentile Formula Explained',
    metaDescription: 'Understand how normalization equalizes difficulty across shifts in SSC, RRB, and state recruitment exams.',
    content: `
      <div class="article-body space-y-6">
        <p class="text-lg leading-relaxed font-medium text-slate-700 dark:text-slate-200">
          When millions of aspirants sit for government exams like SSC CGL or Railway NTPC, tests are held across dozens of shifts over multiple weeks. Because question difficulty naturally varies between shifts, exam bodies use <strong>normalization mathematics</strong> to ensure complete fairness.
        </p>

        <h2 class="text-2xl font-bold mt-8 mb-4">Why Raw Marks Differ from Normalized Marks</h2>
        <p>If Shift 1 had a difficult Mathematics section where the top 0.1% scored an average of 35/50, while Shift 2 had an easier paper where the top 0.1% averaged 46/50, candidates from Shift 1 would be unfairly penalized without normalization.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">Key Principles of the Normalization Formula</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Standard Deviation & Mean of Candidate's Shift:</strong> Gauges the spread and average difficulty of your specific batch.</li>
          <li><strong>Base Shift Benchmark:</strong> Uses the average score of the highest performing shift across the entire exam.</li>
          <li><strong>Accuracy Matters Indirectly:</strong> Having fewer negative marks raises your raw score, giving the normalization multiplier a larger positive boost.</li>
        </ul>
      </div>
    `,
  },
  {
    id: 'top-highest-paying-central-govt-jobs-for-graduates',
    title: 'Top Highest Paying Central Government Jobs for Graduates in 2026',
    slug: 'top-highest-paying-central-govt-jobs-for-graduates',
    category: 'job-guide',
    excerpt: 'Detailed comparison of the top 7th Pay Commission Level 7, 8, and 10 government jobs including in-hand salary, allowances, perks, and promotional avenues.',
    author: 'Job Alert X Editorial Team',
    authorRole: 'Career Guidance Counselor',
    readTime: '7 min read',
    tags: ['Job Guide', 'Highest Salary', 'Central Govt', '7th Pay Commission', 'Career Advice'],
    status: 'published',
    featured: true,
    views: 42100,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    metaTitle: 'Top Highest Paying Govt Jobs for Graduates 2026 — Salary & Perks',
    metaDescription: 'Explore the top paying central government posts with in-hand salary, perks, allowances, and posting locations.',
    content: `
      <div class="article-body space-y-6">
        <p class="text-lg leading-relaxed font-medium text-slate-700 dark:text-slate-200">
          Government jobs in India offer not only unmatched job security and pension benefits, but also attractive pay scales with Dearness Allowance (DA), House Rent Allowance (HRA), and Transport Allowance (TA).
        </p>

        <h2 class="text-2xl font-bold mt-8 mb-4">1. Assistant Section Officer (ASO) in Ministry of External Affairs (MEA)</h2>
        <p>Selected via SSC CGL, MEA ASO officers enjoy prestigious diplomatic postings abroad with high foreign allowances (in US Dollars or local currency), free accommodation, and international school fee reimbursements for children.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">2. RBI Grade B Officer</h2>
        <p>Considered one of the most lucrative regulatory jobs in India. Starting gross salary exceeds <strong>₹1,16,000 per month</strong> with lease accommodation in prime metros, medical allowance, and car fuel allowance.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">3. Assistant Audit Officer (AAO) in CAG</h2>
        <p>The only <strong>Pay Level 8 (Grade Pay 4800)</strong> post filled directly through SSC CGL. Initial basic pay starts at ₹47,600 with total in-hand salary in X Cities touching ₹82,000+ per month.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">4. Inspector of Income Tax & GST / Central Excise</h2>
        <p>Pay Level 7 posts offering immense administrative authority, respect, and accelerated career progression to Assistant Commissioner rank.</p>
      </div>
    `,
  },
]

export async function run() {
  console.log('Seeding articles table...')
  await initDb({ sync: true, alter: true })

  for (const article of seedArticlesData) {
    const existing = await Article.findByPk(article.id)
    if (existing) {
      await existing.update(article)
      console.log(`Updated article: ${article.title}`)
    } else {
      await Article.create(article)
      console.log(`Created article: ${article.title}`)
    }
  }

  console.log('Finished seeding articles successfully.')
  await closeDatabase()
}

// Allow direct execution
if (process.argv[1]?.endsWith('seedArticles.js')) {
  run().catch((err) => {
    console.error('Failed to seed articles:', err)
    process.exit(1)
  })
}
