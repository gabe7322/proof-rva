import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import useAirtable from '../hooks/useAirtable'
import { COPY } from '../constants/copy'

const EMPTY_FORM = {
  name: '', email: '', city: 'Richmond, VA', discipline: '',
  proudWork: '', futureWork: '',
  collaborators: '', project: '', excites: [],
  commitment: '', anythingElse: '',
  _gotcha: '',
}

const STEP_REQUIRED = {
  1: ['name', 'email', 'city', 'discipline'],
  2: ['proudWork', 'futureWork'],
  3: [],
  4: ['commitment'],
}

const slideVariants = {
  enter:  { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit:   { opacity: 0, x: -40 },
}

function ProgressBar({ step, total = 4 }) {
  return (
    <div className="flex items-center gap-0 px-6 py-4 bg-proof-bg-surf border-b border-proof-border">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors duration-200 ${
              i + 1 === step
                ? 'bg-proof-accent text-proof-text'
                : i + 1 < step
                ? 'bg-proof-bg-surf border border-proof-border-md text-proof-faint'
                : 'border border-proof-border text-proof-faint'
            }`}
          >
            {i + 1}
          </div>
          {i < total - 1 && <div className="flex-1 h-px bg-proof-border mx-1" />}
        </div>
      ))}
    </div>
  )
}

function Field({ label, id, children, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs text-proof-mute">
        {label}{required && <span className="text-proof-accent ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass = 'bg-proof-bg-surf border border-proof-border rounded text-proof-text text-sm px-3 py-2.5 outline-none focus:border-proof-border-md transition-colors w-full'

export default function Application() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const { submit, status, error } = useAirtable()

  const c = COPY.application

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const toggleExcites = (val) =>
    setForm((f) => ({
      ...f,
      excites: f.excites.includes(val)
        ? f.excites.filter((v) => v !== val)
        : [...f.excites, val],
    }))

  const validate = (s) => {
    const errs = {}
    STEP_REQUIRED[s].forEach((field) => {
      if (!form[field] || (typeof form[field] === 'string' && !form[field].trim())) {
        errs[field] = 'Required'
      }
    })
    if (s === 2 && form.futureWork.trim().length > 0 && form.futureWork.trim().length < 30) {
      errs.futureWork = 'Please share at least 30 characters'
    }
    if (s === 3 && form.collaborators.trim().length > 0 && form.collaborators.trim().length < 30) {
      errs.collaborators = 'Please share at least 30 characters'
    }
    return errs
  }

  const advance = () => {
    const errs = validate(step)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep((s) => s + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(4)
    if (Object.keys(errs).length) { setErrors(errs); return }
    await submit(form)
  }

  if (status === 'success') {
    const isLearnMore = form.commitment === 'learn_more'
    return (
      <section id="apply" className="bg-proof-bg px-6 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="max-w-md">
          <p className="text-proof-text text-lg leading-relaxed">
            {isLearnMore ? c.learnMore : c.confirmation}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="apply" className="bg-proof-bg px-6 md:px-16 lg:px-24 py-24 md:py-32">
      <div className="max-w-lg">
        <ScrollReveal>
          <p className="eyebrow mb-4">{c.eyebrow}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <h2 className="text-proof-text font-bold mb-10"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}
          >
            {c.headline}
          </h2>
        </ScrollReveal>

        {/* Hidden honeypot */}
        <input
          name="_gotcha"
          value={form._gotcha}
          onChange={set('_gotcha')}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="border border-proof-border-md rounded-lg overflow-hidden">
          <ProgressBar step={step} />

          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.form
                key={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="p-6 flex flex-col gap-4 bg-proof-bg-alt"
                onSubmit={handleSubmit}
                noValidate
              >
                {/* STEP 1 */}
                {step === 1 && (
                  <>
                    <p className="text-xs tracking-widest uppercase text-proof-faint mb-2">Step 1 of 4 — Who You Are</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="Name" id="name" required>
                        <input id="name" className={inputClass} value={form.name} onChange={set('name')} placeholder="Your name" />
                        {errors.name && <span className="text-proof-accent text-xs">{errors.name}</span>}
                      </Field>
                      <Field label="Email" id="email" required>
                        <input id="email" type="email" className={inputClass} value={form.email} onChange={set('email')} placeholder="you@example.com" />
                        {errors.email && <span className="text-proof-accent text-xs">{errors.email}</span>}
                      </Field>
                    </div>
                    <Field label="City" id="city" required>
                      <input id="city" className={inputClass} value={form.city} onChange={set('city')} placeholder="Richmond, VA" />
                      {errors.city && <span className="text-proof-accent text-xs">{errors.city}</span>}
                    </Field>
                    <Field label="Discipline" id="discipline" required>
                      <select id="discipline" className={inputClass} value={form.discipline} onChange={set('discipline')}>
                        <option value="">Select...</option>
                        {c.disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      {errors.discipline && <span className="text-proof-accent text-xs">{errors.discipline}</span>}
                    </Field>
                  </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <>
                    <p className="text-xs tracking-widest uppercase text-proof-faint mb-2">Step 2 of 4 — Your Work</p>
                    <Field label="Link to or describe the work you're most proud of right now" id="proudWork" required>
                      <textarea id="proudWork" className={`${inputClass} min-h-[80px] py-2`} value={form.proudWork} onChange={set('proudWork')} />
                      {errors.proudWork && <span className="text-proof-accent text-xs">{errors.proudWork}</span>}
                    </Field>
                    <Field label="What kind of work do you want to be making a year from now?" id="futureWork" required>
                      <textarea id="futureWork" className={`${inputClass} min-h-[80px] py-2`} value={form.futureWork} onChange={set('futureWork')} />
                      {errors.futureWork && <span className="text-proof-accent text-xs">{errors.futureWork}</span>}
                    </Field>
                  </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <>
                    <p className="text-xs tracking-widest uppercase text-proof-faint mb-1">Step 3 of 4 — Getting to Know You</p>
                    <p className="text-proof-mute text-sm italic mb-2">{c.step3Intro}</p>
                    <Field label="What kind of people are you hoping to meet through something like this?" id="collaborators">
                      <textarea id="collaborators" className={`${inputClass} min-h-[72px] py-2`} value={form.collaborators} onChange={set('collaborators')} />
                      {errors.collaborators && <span className="text-proof-accent text-xs">{errors.collaborators}</span>}
                    </Field>
                    <Field label="Is there a project or idea you've been sitting on but haven't had the right people around you to start?" id="project">
                      <textarea id="project" className={`${inputClass} min-h-[72px] py-2`} value={form.project} onChange={set('project')} />
                    </Field>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-proof-mute">What part of PROOF excites you most?</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {c.excitesOptions.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleExcites(opt)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                              form.excites.includes(opt)
                                ? 'bg-proof-accent border-proof-accent text-proof-text'
                                : 'border-proof-border-md text-proof-mute hover:border-proof-border-md'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <>
                    <p className="text-xs tracking-widest uppercase text-proof-faint mb-2">Step 4 of 4 — Last Step</p>
                    <div className="flex flex-col gap-2">
                      <p className="text-proof-text text-sm leading-relaxed mb-3">{c.commitmentQuestion}</p>
                      {c.commitmentOptions.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="commitment"
                            value={opt.value}
                            checked={form.commitment === opt.value}
                            onChange={set('commitment')}
                            className="accent-proof-accent"
                          />
                          <span className="text-proof-mute text-sm group-hover:text-proof-text transition-colors">{opt.label}</span>
                        </label>
                      ))}
                      {errors.commitment && <span className="text-proof-accent text-xs">{errors.commitment}</span>}
                    </div>
                    <Field label="Anything else you'd like us to know? (optional)" id="anythingElse">
                      <textarea id="anythingElse" className={`${inputClass} min-h-[72px] py-2`} value={form.anythingElse} onChange={set('anythingElse')} />
                    </Field>
                  </>
                )}

                {/* Error banner */}
                {error && (
                  <p className="text-proof-accent text-sm">Something went wrong — please try again.</p>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-2">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="text-proof-mute text-xs uppercase tracking-wide hover:text-proof-text transition-colors"
                    >
                      ← Back
                    </button>
                  )}
                  <div className="ml-auto">
                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={advance}
                        className="bg-proof-accent text-proof-text text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-sm hover:opacity-90 transition-opacity"
                      >
                        {c.continueLabel}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="bg-proof-accent text-proof-text text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {status === 'loading' ? 'Sending...' : c.submitLabel}
                      </button>
                    )}
                  </div>
                </div>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
