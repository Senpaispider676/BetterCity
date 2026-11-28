import React, { useState } from 'react';
import { useReports } from '../contexts/ReportContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import {
  BookOpen,
  Volume2,
  Clock,
  Sparkles,
  Share2,
  ArrowRight,
  BookmarkCheck,
  Compass,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Chapter {
  id: string;
  number?: string;
  title: string;
  subtitle?: string;
  content: string[];
  quote?: string;
}

const DOCUMENTARY_SECTIONS: Chapter[] = [
  {
    id: 'prologue',
    title: 'PROLOGUE — THE CITY NEVER SPEAKS',
    content: [
      'Every morning, millions of people wake up in cities that never truly sleep.',
      'The streets begin to fill. Shops open their shutters. Buses move through crowded roads. Students walk to school, workers travel to their workplaces, and somewhere between the noise of traffic and the rush of daily life, another day begins.',
      'But beneath the familiar rhythm of a city lies a reality that is often overlooked.',
      'A broken road that has remained unrepaired for months. A pothole that becomes dangerous after every rainfall. Garbage accumulating where it shouldn\'t. A streetlight that has stopped working. A public space slowly disappearing beneath neglect.',
      'These problems are so common that people eventually stop noticing them.',
      'They learn to walk around broken pavements. They learn which roads to avoid. They accept overflowing garbage bins, damaged infrastructure, and inconveniences that should never have become normal.',
      'And when a problem becomes part of everyday life, people begin to believe that nothing can change.',
      'But cities aren\'t supposed to be defined by their problems.',
      'They are defined by the people who live in them.',
      'Better City was created around one simple belief: a better city begins when someone refuses to ignore what is wrong.'
    ],
    quote: 'A better city begins when someone refuses to ignore what is wrong.'
  },
  {
    id: 'chapter-1',
    number: '01',
    title: 'CHAPTER 1 — THE PROBLEMS WE LEARN TO IGNORE',
    content: [
      'Cities are constantly growing.',
      'New buildings rise. Roads expand. Businesses open. Technology advances. Governments introduce new projects intended to improve the lives of millions.',
      'Yet, despite all this development, some of the most basic problems remain.',
      'Infrastructure deteriorates. Public spaces become neglected. Small civic issues remain unresolved because they are considered too insignificant, too ordinary, or too difficult to address.',
      'A pothole might seem like a minor inconvenience until it becomes a daily obstacle for hundreds of commuters.',
      'An overflowing waste container might appear to be an isolated issue until it affects an entire neighbourhood.',
      'A damaged footpath might seem unimportant until someone is forced to walk onto a busy road because the pavement is no longer usable.',
      'These are not merely physical problems.',
      'They affect how people experience their surroundings, how safe they feel, how much time they lose, and how they perceive the places they call home.',
      'The problem is not always a lack of awareness.',
      'Sometimes, the problem is that awareness exists everywhere except where it needs to reach.',
      'A resident notices an issue. Someone else experiences it. Another person complains about it. But the information rarely moves beyond conversations, social media posts, or temporary frustration.',
      'There is no clear connection between noticing a problem and helping it become visible to the people responsible for addressing it.',
      'And somewhere in that gap, problems remain.'
    ],
    quote: 'Awareness exists everywhere except where it needs to reach.'
  },
  {
    id: 'chapter-2',
    number: '02',
    title: 'CHAPTER 2 — A VOICE THAT GETS LOST',
    content: [
      'Imagine discovering a damaged road outside your home.',
      'You see it every day. You know it is getting worse. You have watched people struggle to navigate around it.',
      'You want to report it.',
      'But then the questions begin.',
      'Where do you report it? Which department is responsible? Is there a website? Is there an application? Will anyone actually see your complaint? What happens after you submit it?',
      'For many people, the process becomes exhausting before it even begins.',
      'Others simply give up.',
      'Not because they don\'t care, but because they don\'t know where to start.',
      'This is one of the quiet failures of civic participation. People are willing to speak, but the process of being heard can feel complicated, fragmented, and uncertain.',
      'A city may have systems for handling public complaints, yet those systems are not always easy for ordinary citizens to discover or navigate.',
      'The result is a familiar cycle.',
      'A problem appears. People notice. People complain. The complaint disappears into a process they cannot see. Eventually, frustration replaces expectation. And the problem remains.',
      'Better City seeks to challenge this cycle by making civic issues easier to bring into the open.',
      'Because reporting a problem shouldn\'t require understanding an entire administrative system.',
      'It should begin with something simple: seeing an issue, documenting it, and giving it visibility.'
    ],
    quote: 'Reporting a problem shouldn\'t require understanding an entire administrative system.'
  },
  {
    id: 'chapter-3',
    number: '03',
    title: 'CHAPTER 3 — THE IDEA BEHIND BETTER CITY',
    content: [
      'Better City is built around a simple concept.',
      'Cities can improve when the people who live in them are given a clearer way to identify, document, and raise attention to local problems.',
      'It is not about transforming every citizen into an activist.',
      'It is not about replacing municipal authorities.',
      'And it is not about pretending that every problem can be solved overnight.',
      'It is about creating a bridge between everyday observations and meaningful civic awareness.',
      'A place where a damaged road is more than an inconvenience hidden in plain sight. Where a neglected public space can be brought to attention. Where people can contribute to understanding what is happening around them. Where the problems of a neighbourhood are not reduced to isolated complaints, but become visible parts of a larger picture.',
      'Better City represents the idea that civic improvement does not always begin with a large project, a major investment, or a government announcement.',
      'Sometimes, it begins with one photograph. One location. One report. One person deciding that a problem deserves to be noticed.',
      'And when enough people begin paying attention, the conversation around a city can change.'
    ],
    quote: 'Civic improvement begins with one photograph, one location, one report, one person deciding that a problem deserves to be noticed.'
  },
  {
    id: 'chapter-4',
    number: '04',
    title: 'CHAPTER 4 — BEYOND THE SCREEN',
    content: [
      'Technology alone cannot repair a road.',
      'It cannot collect garbage, replace a broken streetlight, reconstruct a footpath, or maintain a public park.',
      'A website cannot promise that every reported problem will receive immediate attention.',
      'But technology can do something important.',
      'It can make information easier to share.',
      'It can reduce the distance between people experiencing a problem and the people who need to know about it.',
      'It can help organize scattered observations into something understandable.',
      'It can turn individual experiences into a collective picture.',
      'The purpose of Better City is not to make technology the hero of the story. The purpose is to make people the heroes.',
      'Behind every report is someone who lives in that area. Behind every damaged road is someone who travels across it. Behind every neglected corner is a community that deserves better. Behind every civic issue is a human experience that often goes unnoticed.',
      'Better City uses technology as a tool — not an end in itself.',
      'Because the true value of any digital platform should not be measured only by how modern it looks, how many features it contains, or how sophisticated its interface may be.',
      'Its value should be measured by whether it makes something genuinely useful easier for someone.'
    ],
    quote: 'The purpose of Better City is not to make technology the hero of the story. The purpose is to make people the heroes.'
  },
  {
    id: 'chapter-5',
    number: '05',
    title: 'CHAPTER 5 — THE POWER OF COLLECTIVE AWARENESS',
    content: [
      'A single report can reveal a problem. Multiple reports can reveal a pattern.',
      'When people begin documenting the issues around them, something changes.',
      'A problem that once appeared isolated may turn out to be widespread. A road that one resident believed was neglected may be part of a larger infrastructure issue. A public space that one person thought had been forgotten may be a concern shared by an entire community.',
      'Collective awareness does not automatically guarantee action.',
      'But it makes ignorance more difficult.',
      'It creates a record of what people are experiencing. It encourages discussion. It allows communities to recognize shared concerns instead of dealing with every problem individually.',
      'And perhaps most importantly, it reminds people that they are not alone in wanting their surroundings to improve.',
      'Cities are often discussed through statistics, planning documents, budgets, and development proposals.',
      'But the lived experience of a city is much more personal.',
      'It is the road someone takes to school. The street someone walks home on. The park where children spend their evenings. The neighbourhood where families have lived for generations.',
      'Better City is interested in these everyday experiences — the small details that collectively shape the quality of life in a city.'
    ],
    quote: 'A single report can reveal a problem. Multiple reports can reveal a pattern.'
  },
  {
    id: 'chapter-6',
    number: '06',
    title: 'CHAPTER 6 — THE CHALLENGE OF CHANGE',
    content: [
      'The idea of improving a city is easy to express. The reality is far more complicated.',
      'Urban problems have multiple causes. Responsibilities are divided across departments. Resources are limited. Infrastructure requires planning, funding, maintenance, and time.',
      'Some issues can be addressed quickly. Others may take months or years.',
      'Some require engineering assessments. Some depend on municipal budgets. Some involve multiple authorities. Some cannot be resolved without long-term planning.',
      'Better City understands that visibility is not the same as resolution.',
      'A reported issue is not necessarily a repaired issue. A photograph is not a replacement for infrastructure. And a platform cannot promise outcomes that depend on decisions and actions beyond its control.',
      'But acknowledging these limitations does not make participation meaningless.',
      'It makes participation more honest.',
      'The goal is not to promise instant change.',
      'The goal is to help create a clearer picture of the problems that exist, encourage responsible reporting, and support a culture in which people care about the places they live.',
      'Change is rarely immediate. Sometimes it is slow, complicated, and frustrating. But progress becomes more possible when problems are no longer invisible.'
    ],
    quote: 'Progress becomes more possible when problems are no longer invisible.'
  },
  {
    id: 'chapter-7',
    number: '07',
    title: 'CHAPTER 7 — THE CITY BELONGS TO EVERYONE',
    content: [
      'A city is not owned by its tallest building. It is not defined by its busiest road, its most expensive neighbourhood, or its newest development.',
      'A city belongs to the people who inhabit it.',
      'The student crossing a damaged street. The shopkeeper opening his business every morning. The family living beside a neglected public space. The commuter waiting for public transport. The resident who has spent years watching their neighbourhood change.',
      'Each of them experiences the city differently. Each of them has a perspective worth understanding. And each of them has a role, however small, in shaping the future of their surroundings.',
      'Civic responsibility should not be reserved for officials, planners, or institutions. It should also belong to the people who experience the consequences of urban decisions every day.',
      'Not everyone has the time to attend meetings. Not everyone understands government procedures. Not everyone knows which authority is responsible for a particular issue.',
      'But almost everyone can recognize when something around them needs attention.',
      'Better City starts from that recognition.',
      'It believes that caring about your surroundings is not a complicated political statement. It is a simple act of responsibility.'
    ],
    quote: 'Caring about your surroundings is not a complicated political statement. It is a simple act of responsibility.'
  },
  {
    id: 'chapter-8',
    number: '08',
    title: 'CHAPTER 8 — BUILDING A BETTER CITY, ONE ISSUE AT A TIME',
    content: [
      'The future of cities will not be determined by technology alone.',
      'It will depend on decisions, planning, cooperation, public accountability, and the willingness of people to participate in the communities they inhabit.',
      'Smart cities are not simply cities filled with sensors, applications, digital displays, and automated systems.',
      'A truly smarter city is one that understands its people. One that listens. One that recognizes problems before they become accepted as permanent. One that makes participation easier rather than more complicated. One that treats public infrastructure not as an afterthought, but as an essential part of everyday life.',
      'Better City is a small step toward that vision.',
      'It does not claim to have every answer. It does not claim to be the solution to every urban challenge.',
      'Instead, it exists as a reminder that improvement is possible — and that the process of improvement should include the people who live with these challenges every day.',
      'Every issue made visible is an opportunity to understand.',
      'Every person who participates contributes to awareness.',
      'Every community that refuses to ignore its surroundings takes a step toward a better future.',
      'And every small improvement matters.'
    ],
    quote: 'A truly smarter city is one that understands its people. One that listens.'
  },
  {
    id: 'epilogue',
    title: 'EPILOGUE — TOMORROW STARTS HERE',
    content: [
      'Tomorrow morning, the city will wake up again.',
      'The traffic will return. The shops will open. The streets will fill.',
      'Some problems will still be there. Some new ones will appear.',
      'And somewhere, someone will notice something that needs to change.',
      'Perhaps it will be a damaged road. Perhaps it will be an overflowing bin. Perhaps it will be a streetlight that has gone dark. Perhaps it will be something that has been ignored for far too long.',
      'That person will have a choice.',
      'To walk past it. Or to bring it into the open.',
      'Better City exists for the second choice.',
      'Because a better city does not begin when everything is perfect. It begins when people decide that imperfection should not be ignored.',
      'It begins with awareness. It begins with responsibility. It begins with participation.',
      'And sometimes, it begins with just one person who cares enough to say:',
      'This can be better. And we should do something about it.'
    ],
    quote: 'Better City — Small acts, big change.'
  }
];

export const DocsPage: React.FC = () => {
  const { openReportModal, setActiveTab } = useReports();
  const { speak } = useAccessibility();
  const [activeSection, setActiveSection] = useState<string>('prologue');
  const [copied, setCopied] = useState(false);

  const handleListenToSection = (chapter: Chapter) => {
    const textToRead = `${chapter.title}. ${chapter.content.join(' ')}`;
    speak(textToRead);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-spatial-bg text-spatial-text">
      {/* Editorial Hero Header */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-spatial-border bg-gradient-to-b from-slate-100/80 via-white to-transparent dark:from-white/[0.04] dark:via-transparent dark:to-transparent pt-8 sm:pt-14 pb-10 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          {/* Badge & Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DOCUMENTARY & MANIFESTO • SMALL ACTS, BIG CHANGE</span>
          </div>

          {/* Documentary Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            The City We Live In, <br className="hidden sm:inline" />
            <span className="text-emerald-600 dark:text-spatial-blue">and the City We Deserve</span>
          </h1>

          {/* Documentary Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-600 dark:text-spatial-muted leading-relaxed">
            An independent documentary about urban problems, forgotten voices, and the power of ordinary people to make their cities better.
          </p>

          {/* Quick Meta Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-spatial-muted">
              <Clock className="w-3.5 h-3.5" />
              <span>7 min read</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-spatial-muted">
              <BookOpen className="w-3.5 h-3.5" />
              <span>10 Chapters</span>
            </span>

            <button
              onClick={() => handleListenToSection(DOCUMENTARY_SECTIONS[0])}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 font-medium transition-colors cursor-pointer"
              title="Listen to prologue with Text-to-Speech"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen Aloud (TTS)</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-spatial-muted transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Reading Container: Table of Contents + Chapter Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Sticky Table of Contents (Desktop Sidebar) */}
          <aside className="lg:col-span-4 sticky top-24 hidden lg:block">
            <div className="rounded-2xl border border-slate-200 dark:border-spatial-border bg-white/80 dark:bg-spatial-card/90 backdrop-blur-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-spatial-border font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-spatial-muted">
                <BookmarkCheck className="w-4 h-4 text-emerald-500" />
                <span>Documentary Chapters</span>
              </div>

              <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
                {DOCUMENTARY_SECTIONS.map((sec, idx) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30'
                          : 'text-slate-600 dark:text-spatial-muted hover:text-slate-900 dark:hover:text-spatial-text hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] text-slate-400 dark:text-spatial-muted">
                          {idx === 0 ? 'P' : idx === DOCUMENTARY_SECTIONS.length - 1 ? 'E' : `0${idx}`}
                        </span>
                        <span className="truncate">
                          {sec.title.split('—')[1]?.trim() || sec.title}
                        </span>
                      </div>
                      <ChevronRight className={`w-3 h-3 transition-transform ${isActive ? 'translate-x-0.5 text-emerald-500' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} />
                    </button>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-slate-200 dark:border-spatial-border">
                <button
                  onClick={openReportModal}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-spatial-blue hover:bg-slate-800 dark:hover:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Act Now: Report Issue</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Chapters Prose */}
          <article className="lg:col-span-8 space-y-12 sm:space-y-16">
            {DOCUMENTARY_SECTIONS.map((sec) => (
              <motion.section
                key={sec.id}
                id={sec.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.35 }}
                className="scroll-mt-24 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-spatial-border bg-white dark:bg-spatial-card shadow-sm space-y-6 relative group"
              >
                {/* Header with Chapter Title & Voice Read button */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-spatial-border">
                  <div>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                      {sec.title.split('—')[0]?.trim()}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
                      {sec.title.split('—')[1]?.trim() || sec.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => handleListenToSection(sec)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-emerald-500/15 hover:text-emerald-500 text-slate-500 dark:text-spatial-muted transition-colors shrink-0"
                    title="Read this chapter aloud"
                    aria-label={`Read ${sec.title} aloud`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Chapter Paragraphs */}
                <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-spatial-text/90 leading-relaxed font-normal">
                  {sec.content.map((p, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Featured Quote / Key Insight Callout */}
                {sec.quote && (
                  <div className="my-6 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border-l-4 border-emerald-500 border-y border-r border-slate-200/60 dark:border-white/5">
                    <p className="italic text-sm sm:text-base font-medium text-slate-800 dark:text-white">
                      "{sec.quote}"
                    </p>
                  </div>
                )}
              </motion.section>
            ))}

            {/* Concluding Action Banner */}
            <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl space-y-6 border border-emerald-500/30">
              <div className="space-y-2">
                <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
                  BETTER CITY — SMALL ACTS, BIG CHANGE
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  See the problem. Make it visible. Build a better tomorrow.
                </h3>
                <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                  Join thousands of citizens transforming quiet frustration into documented municipal action. One photo, one report, one neighborhood at a time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={openReportModal}
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <span>Report an Issue Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('home')}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer"
                >
                  Explore Interactive Map
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
