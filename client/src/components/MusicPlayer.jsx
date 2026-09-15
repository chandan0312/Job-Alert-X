import { useState, useEffect } from 'react'
import {
  Quote,
  Sparkles,
  Shuffle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Copy,
  Check,
  Heart,
  Languages,
} from 'lucide-react'

const MOTIVATION_QUOTES = [
  // === HINDI MOTIVATIONAL QUOTES (FOR SARKARI ASPIRANTS) ===
  {
    id: 1,
    lang: 'hi',
    quote: 'सपने वो नहीं जो हम सोते हुए देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।',
    author: 'डॉ. ए.पी.जे. अब्दुल कलाम',
    tag: 'विज़न और लक्ष्य',
    gradient: ['#f59e0b', '#ea580c'],
    category: 'Daily Wisdom',
  },
  {
    id: 2,
    lang: 'hi',
    quote: 'उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।',
    author: 'स्वामी विवेकानंद',
    tag: 'अटूट संकल्प',
    gradient: ['#ec4899', '#8b5cf6'],
    category: 'Determination',
  },
  {
    id: 3,
    lang: 'hi',
    quote: 'शिक्षा वह शेरनी का दूध है, जो पिएगा वह निश्चित रूप से दहाड़ेगा।',
    author: 'डॉ. बी.आर. अम्बेडकर',
    tag: 'ज्ञान की शक्ति',
    gradient: ['#3b82f6', '#1d4ed8'],
    category: 'Education',
  },
  {
    id: 4,
    lang: 'hi',
    quote: 'मंजिलें उन्हीं को मिलती हैं जिनके सपनों में जान होती है, पंखों से कुछ नहीं होता हौसलों से उड़ान होती है!',
    author: 'सफलता सूत्र',
    tag: 'हौसला',
    gradient: ['#10b981', '#047857'],
    category: 'Courage',
  },
  {
    id: 5,
    lang: 'hi',
    quote: 'सीढ़ियों की ज़रूरत उन्हें है जिन्हें छत पर जाना है, मेरी मंजिल तो आसमां है, रास्ता खुद बनाना है!',
    author: 'एस्पिरेंट मंत्र',
    tag: 'आत्मविश्वास',
    gradient: ['#f97316', '#c2410c'],
    category: 'Self Belief',
  },
  {
    id: 6,
    lang: 'hi',
    quote: 'हौसले के तरकश में कोशिश का वो तीर ज़िंदा रखो, हार जाओ चाहे सब कुछ मगर जीतने की उम्मीद ज़िंदा रखो।',
    author: 'दृढ़ संकल्प',
    tag: 'धैर्य व संघर्ष',
    gradient: ['#6366f1', '#4338ca'],
    category: 'Perseverance',
  },
  {
    id: 7,
    lang: 'hi',
    quote: 'रख हौसला वो मंज़र भी आएगा, प्यासे के पास चलकर समंदर भी आएगा; थक कर न बैठ ऐ मुसाफ़िर, मंज़िल भी मिलेगी और मिलने का मज़ा भी आएगा!',
    author: 'कवि प्रेरणा',
    tag: 'विजय संकल्प',
    gradient: ['#06b6d4', '#0891b2'],
    category: 'Victory',
  },

  // === ENGLISH MOTIVATIONAL QUOTES ===
  {
    id: 8,
    lang: 'en',
    quote: 'Dream is not that which you see while sleeping, it is something that does not let you sleep.',
    author: 'Dr. A.P.J. Abdul Kalam',
    tag: 'Vision & Hard Work',
    gradient: ['#f59e0b', '#ea580c'],
    category: 'Daily Wisdom',
  },
  {
    id: 9,
    lang: 'en',
    quote: 'It always seems impossible until it is done. Keep pushing through every mock test.',
    author: 'Nelson Mandela',
    tag: 'Perseverance',
    gradient: ['#10b981', '#047857'],
    category: 'Exam Mindset',
  },
  {
    id: 10,
    lang: 'en',
    quote: 'Consistency and relentless discipline turn ordinary aspirants into top officers.',
    author: 'UPSC Aspirant Motto',
    tag: 'Discipline',
    gradient: ['#f97316', '#c2410c'],
    category: 'Motivation',
  },
]

export default function MusicPlayer() {
  const [langFilter, setLangFilter] = useState('hi') // Default to Hindi quotes
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)

  // Filter quotes by selected language
  const filteredQuotes = MOTIVATION_QUOTES.filter(
    (q) => langFilter === 'all' || q.lang === langFilter
  )

  // Safe current quote
  const activeIndex = currentIndex < filteredQuotes.length ? currentIndex : 0
  const current = filteredQuotes[activeIndex] || filteredQuotes[0]
  const [c1, c2] = current.gradient

  // Auto-advance quote every 6.5 seconds when autoPlay is active
  useEffect(() => {
    if (!autoPlay) return

    const interval = 50 // ms
    const duration = 6500 // 6.5 seconds per quote
    const step = (interval / duration) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % filteredQuotes.length)
          return 0
        }
        return prev + step
      })
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, currentIndex, filteredQuotes.length])

  const handleNext = () => {
    setProgress(0)
    setCurrentIndex((prev) => (prev + 1) % filteredQuotes.length)
  }

  const handlePrev = () => {
    setProgress(0)
    setCurrentIndex((prev) => (prev === 0 ? filteredQuotes.length - 1 : prev - 1))
  }

  const handleShuffle = () => {
    setProgress(0)
    let nextIdx
    do {
      nextIdx = Math.floor(Math.random() * filteredQuotes.length)
    } while (nextIdx === activeIndex && filteredQuotes.length > 1)
    setCurrentIndex(nextIdx)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${current.quote}" — ${current.author}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLangToggle = (lang) => {
    setProgress(0)
    setCurrentIndex(0)
    setLangFilter(lang)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1322] via-[#111c33] to-[#0a0f1d] p-4 text-white shadow-card border border-white/[0.08]">
      {/* Decorative Background Quote Watermark */}
      <span
        className="pointer-events-none absolute -right-2 -bottom-6 text-[110px] font-serif leading-none text-white/[0.03] select-none"
        aria-hidden="true"
      >
        “
      </span>

      {/* Top Header Badge & Language Toggle */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider text-amber-400">
          <Sparkles size={14} className="animate-spin-slow text-amber-400" />
          <span>प्रेरणा / Motivation</span>
        </div>

        {/* Language Tabs & Copy/Like */}
        <div className="flex items-center gap-1.5">
          {/* Language Switch Pills */}
          <div className="flex items-center rounded-lg bg-white/[0.07] p-0.5 border border-white/10 text-[10.5px] font-bold">
            <button
              type="button"
              onClick={() => handleLangToggle('hi')}
              className={`rounded-md px-1.5 py-0.5 transition-colors ${
                langFilter === 'hi'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => handleLangToggle('en')}
              className={`rounded-md px-1.5 py-0.5 transition-colors ${
                langFilter === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => handleLangToggle('all')}
              className={`rounded-md px-1.5 py-0.5 transition-colors ${
                langFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
          </div>

          {/* Copy Quote Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            title="Copy Quote"
            aria-label="Copy Quote"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>

          {/* Like Quote Button */}
          <button
            type="button"
            onClick={() => setLiked((l) => !l)}
            className={`rounded-lg p-1 transition-colors ${liked ? 'text-rose-500' : 'text-slate-400 hover:text-white'}`}
            title="Save to favorites"
            aria-label="Like quote"
          >
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Quote Body Area */}
      <div className="relative my-2 min-h-[95px] flex flex-col justify-center">
        <div className="flex items-start gap-2">
          <Quote size={18} className="shrink-0 text-amber-400/80 mt-0.5" />
          <p className="text-[13px] sm:text-[13.5px] font-medium leading-relaxed text-slate-100 italic transition-all duration-300">
            "{current.quote}"
          </p>
        </div>

        {/* Author & Tag Footer */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white shadow-sm ring-1 ring-white/20"
              style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
            >
              {current.author.charAt(0)}
            </span>
            <span className="text-[12px] font-bold text-amber-200 truncate">
              {current.author}
            </span>
          </div>

          <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-white/10">
            {current.tag}
          </span>
        </div>
      </div>

      {/* Progress Bar for Auto-Cycle */}
      <div className="mt-3">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Interactive Controls (Shuffle, Prev, Play/Pause, Next) */}
      <div className="mt-3 flex items-center justify-between pt-1">
        {/* Shuffle Quote */}
        <button
          type="button"
          onClick={handleShuffle}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-amber-300 transition-colors"
          title="Random Quote"
          aria-label="Random Quote"
        >
          <Shuffle size={15} />
        </button>

        {/* Previous Quote */}
        <button
          type="button"
          onClick={handlePrev}
          className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          title="Previous Quote"
          aria-label="Previous Quote"
        >
          <SkipBack size={16} fill="currentColor" />
        </button>

        {/* Play/Pause Auto-Cycle */}
        <button
          type="button"
          onClick={() => setAutoPlay((p) => !p)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold shadow-md shadow-orange-500/20 hover:scale-105 transition-transform"
          title={autoPlay ? 'Pause Auto-cycle' : 'Play Auto-cycle'}
          aria-label={autoPlay ? 'Pause' : 'Play'}
        >
          {autoPlay ? <Pause size={15} fill="currentColor" /> : <Play size={15} className="ml-0.5" fill="currentColor" />}
        </button>

        {/* Next Quote */}
        <button
          type="button"
          onClick={handleNext}
          className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          title="Next Quote"
          aria-label="Next Quote"
        >
          <SkipForward size={16} fill="currentColor" />
        </button>

        {/* Quote Counter indicator */}
        <span className="text-[11px] font-bold text-slate-400 tabular-nums">
          {activeIndex + 1}/{filteredQuotes.length}
        </span>
      </div>
    </div>
  )
}
