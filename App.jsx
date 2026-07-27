import { useState, useEffect, useMemo } from 'react'

// ============================================================
// Constantes
// ============================================================

const STORAGE_KEY = 'gym_v1'

const MUSCLES = ['Pecho', 'Hombros', 'Tríceps', 'Espalda', 'Bíceps', 'Piernas']

const DEFAULT_EXERCISES = [
  { id: 'e1', name: 'Press banca', muscle: 'Pecho' },
  { id: 'e2', name: 'Aperturas', muscle: 'Pecho' },
  { id: 'e3', name: 'Press militar', muscle: 'Hombros' },
  { id: 'e4', name: 'Elevaciones laterales', muscle: 'Hombros' },
  { id: 'e5', name: 'Fondos en paralelas', muscle: 'Tríceps' },
  { id: 'e6', name: 'Extensión en polea con cuerda', muscle: 'Tríceps' },
  { id: 'e7', name: 'Dominadas / Jalón al pecho', muscle: 'Espalda' },
  { id: 'e8', name: 'Remo con barra', muscle: 'Espalda' },
  { id: 'e9', name: 'Remo con mancuernas', muscle: 'Espalda' },
  { id: 'e10', name: 'Lat pulldown', muscle: 'Espalda' },
  { id: 'e11', name: 'Curl con barra', muscle: 'Bíceps' },
  { id: 'e12', name: 'Curl martillo', muscle: 'Bíceps' },
  { id: 'e13', name: 'Sentadilla', muscle: 'Piernas' },
  { id: 'e14', name: 'Prensa', muscle: 'Piernas' },
  { id: 'e15', name: 'Extensión de cuádriceps', muscle: 'Piernas' },
  { id: 'e16', name: 'Curl femoral', muscle: 'Piernas' },
  { id: 'e17', name: 'Peso muerto rumano', muscle: 'Piernas' },
  { id: 'e18', name: 'Gemelos', muscle: 'Piernas' },
]

const CARDIO_TYPES = ['Correr', 'Bicicleta', 'Elíptica', 'Cinta', 'Caminata', 'Escalador', 'Otro']

// ============================================================
// Helpers
// ============================================================

const uid = () => Math.random().toString(36).slice(2, 10)

const todayISO = () => {
  const d = new Date()
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
}

const fmtDate = (iso) => {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const fmtDateShort = (iso) => {
  if (!iso) return ''
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('No pude guardar:', e)
  }
}

// ============================================================
// App
// ============================================================

export default function App() {
  const [tab, setTab] = useState('hoy')
  const [catalog, setCatalog] = useState(DEFAULT_EXERCISES)
  const [sessions, setSessions] = useState([])
  const [sets, setSets] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [loaded, setLoaded] = useState(false)

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const s = loadState()
    if (s) {
      if (s.catalog) setCatalog(s.catalog)
      if (s.sessions) setSessions(s.sessions)
      if (s.sets) setSets(s.sets)
      if (s.activeSessionId) setActiveSessionId(s.activeSessionId)
    }
    setLoaded(true)
  }, [])

  // Persistir cada vez que cambia el estado
  useEffect(() => {
    if (!loaded) return
    saveState({ catalog, sessions, sets, activeSessionId })
  }, [catalog, sessions, sets, activeSessionId, loaded])

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto">
      <Header />
      <main className="flex-1 pb-24 px-4">
        {tab === 'hoy' && (
          <TabHoy
            catalog={catalog}
            sessions={sessions}
            sets={sets}
            setSessions={setSessions}
            setSets={setSets}
            activeSessionId={activeSessionId}
            setActiveSessionId={setActiveSessionId}
          />
        )}
        {tab === 'historial' && (
          <TabHistorial
            catalog={catalog}
            sessions={sessions}
            sets={sets}
            setSessions={setSessions}
            setSets={setSets}
          />
        )}
        {tab === 'progreso' && (
          <TabProgreso catalog={catalog} sessions={sessions} sets={sets} />
        )}
        {tab === 'datos' && (
          <TabDatos
            catalog={catalog}
            setCatalog={setCatalog}
            sessions={sessions}
            sets={sets}
            setSessions={setSessions}
            setSets={setSets}
            setActiveSessionId={setActiveSessionId}
          />
        )}
      </main>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}

// ============================================================
// Header y Nav
// ============================================================

function Header() {
  return (
    <header className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold tracking-tight">
        <span className="text-emerald-400">Gym</span>{' '}
        <span className="text-slate-100">Agustín</span>
      </h1>
    </header>
  )
}

function BottomNav({ tab, setTab }) {
  const items = [
    { id: 'hoy', label: 'Hoy', icon: '🏋️' },
    { id: 'historial', label: 'Historial', icon: '📅' },
    { id: 'progreso', label: 'Progreso', icon: '📈' },
    { id: 'datos', label: 'Datos', icon: '⚙️' },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800">
      <div className="max-w-md mx-auto grid grid-cols-4">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className={`py-3 flex flex-col items-center gap-1 text-xs transition-colors ${
              tab === it.id ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <span className="text-lg">{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// ============================================================
// TAB: HOY
// ============================================================

function TabHoy({
  catalog,
  sessions,
  sets,
  setSessions,
  setSets,
  activeSessionId,
  setActiveSessionId,
}) {
  const activeSession = sessions.find((s) => s.id === activeSessionId)

  if (!activeSession) {
    return (
      <div className="space-y-4">
        <p className="text-slate-400 text-sm">
          No hay sesión abierta. Empezá una nueva:
        </p>
        <button
          onClick={() => {
            const s = { id: uid(), date: todayISO(), kind: 'strength', notes: '' }
            setSessions([s, ...sessions])
            setActiveSessionId(s.id)
          }}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-2xl text-lg"
        >
          🏋️ Sesión de fuerza
        </button>
        <button
          onClick={() => {
            const s = {
              id: uid(),
              date: todayISO(),
              kind: 'cardio',
              cardioType: 'Correr',
              duration: 0,
              distance: 0,
              notes: '',
            }
            setSessions([s, ...sessions])
            setActiveSessionId(s.id)
          }}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold py-4 rounded-2xl text-lg border border-slate-700"
        >
          🏃 Sesión de cardio
        </button>
      </div>
    )
  }

  if (activeSession.kind === 'cardio') {
    return (
      <CardioSession
        session={activeSession}
        sessions={sessions}
        setSessions={setSessions}
        onFinish={() => setActiveSessionId(null)}
        onDelete={() => {
          setSessions(sessions.filter((s) => s.id !== activeSession.id))
          setActiveSessionId(null)
        }}
      />
    )
  }

  return (
    <StrengthSession
      session={activeSession}
      sessions={sessions}
      sets={sets}
      catalog={catalog}
      setSessions={setSessions}
      setSets={setSets}
      onFinish={() => setActiveSessionId(null)}
      onDelete={() => {
        setSessions(sessions.filter((s) => s.id !== activeSession.id))
        setSets(sets.filter((x) => x.sessionId !== activeSession.id))
        setActiveSessionId(null)
      }}
    />
  )
}

// ============================================================
// Sesión de fuerza
// ============================================================

function StrengthSession({
  session,
  sessions,
  sets,
  catalog,
  setSessions,
  setSets,
  onFinish,
  onDelete,
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [exerciseOpen, setExerciseOpen] = useState(null) // exerciseId actualmente abierto

  const sessionSets = sets.filter((s) => s.sessionId === session.id)

  // Ejercicios usados en esta sesión, en orden de primera aparición
  const exercisesInSession = useMemo(() => {
    const seen = []
    for (const s of sessionSets) {
      if (!seen.includes(s.exerciseId)) seen.push(s.exerciseId)
    }
    return seen
  }, [sessionSets])

  const addExercise = (exerciseId) => {
    setPickerOpen(false)
    setExerciseOpen(exerciseId)
  }

  const addSet = (exerciseId, weight, reps) => {
    const orden =
      sessionSets.filter((s) => s.exerciseId === exerciseId).length + 1
    setSets([
      ...sets,
      {
        id: uid(),
        sessionId: session.id,
        exerciseId,
        order: orden,
        weight: Number(weight) || 0,
        reps: Number(reps) || 0,
      },
    ])
  }

  const removeSet = (setId) => {
    setSets(sets.filter((s) => s.id !== setId))
  }

  const updateSession = (patch) => {
    setSessions(sessions.map((s) => (s.id === session.id ? { ...s, ...patch } : s)))
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">
              Sesión de fuerza
            </div>
            <div className="text-lg font-semibold">{fmtDate(session.date)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Ejercicios</div>
            <div className="text-2xl font-bold text-emerald-400">
              {exercisesInSession.length}
            </div>
          </div>
        </div>
        <input
          type="date"
          value={session.date}
          onChange={(e) => updateSession({ date: e.target.value })}
          className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {exercisesInSession.map((exId) => {
        const ex = catalog.find((e) => e.id === exId)
        if (!ex) return null
        const exSets = sessionSets.filter((s) => s.exerciseId === exId)
        return (
          <ExerciseBlock
            key={exId}
            exercise={ex}
            sets={exSets}
            sessions={sessions}
            allSets={sets}
            currentSessionId={session.id}
            open={exerciseOpen === exId}
            onToggle={() => setExerciseOpen(exerciseOpen === exId ? null : exId)}
            onAddSet={(w, r) => addSet(exId, w, r)}
            onRemoveSet={removeSet}
          />
        )
      })}

      <button
        onClick={() => setPickerOpen(true)}
        className="w-full bg-slate-900 border-2 border-dashed border-slate-700 hover:border-emerald-500 py-4 rounded-2xl text-slate-300 font-semibold"
      >
        + Agregar ejercicio
      </button>

      <div className="grid grid-cols-2 gap-3 pt-4">
        <button
          onClick={onDelete}
          className="bg-slate-900 border border-red-900 text-red-400 py-3 rounded-xl font-semibold text-sm"
        >
          Descartar
        </button>
        <button
          onClick={onFinish}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3 rounded-xl font-bold"
        >
          Terminar sesión
        </button>
      </div>

      {pickerOpen && (
        <ExercisePicker
          catalog={catalog}
          excludeIds={exercisesInSession}
          onPick={addExercise}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}

function ExerciseBlock({
  exercise,
  sets: exSets,
  sessions,
  allSets,
  currentSessionId,
  open,
  onToggle,
  onAddSet,
  onRemoveSet,
}) {
  // Último set del ejercicio en la sesión previa (para autocompletar)
  const lastPrevSet = useMemo(() => {
    const prevSessions = sessions
      .filter((s) => s.id !== currentSessionId && s.kind === 'strength')
      .sort((a, b) => (a.date < b.date ? 1 : -1))
    for (const s of prevSessions) {
      const setsOfIt = allSets
        .filter((x) => x.sessionId === s.id && x.exerciseId === exercise.id)
        .sort((a, b) => b.order - a.order)
      if (setsOfIt.length > 0) {
        return { session: s, set: setsOfIt[setsOfIt.length - 1], allSets: setsOfIt.reverse() }
      }
    }
    return null
  }, [sessions, allSets, currentSessionId, exercise.id])

  // Valores por defecto para el formulario: último set de esta sesión, o del último día
  const lastSet = exSets.length > 0 ? exSets[exSets.length - 1] : null
  const defaultWeight = lastSet?.weight ?? lastPrevSet?.set.weight ?? ''
  const defaultReps = lastSet?.reps ?? lastPrevSet?.set.reps ?? ''

  const [weight, setWeight] = useState(String(defaultWeight))
  const [reps, setReps] = useState(String(defaultReps))

  useEffect(() => {
    setWeight(String(defaultWeight))
    setReps(String(defaultReps))
  }, [defaultWeight, defaultReps])

  const volumen = exSets.reduce((acc, s) => acc + s.weight * s.reps, 0)

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="text-left">
          <div className="font-semibold">{exercise.name}</div>
          <div className="text-xs text-slate-400">
            {exercise.muscle} · {exSets.length} {exSets.length === 1 ? 'set' : 'sets'}
            {volumen > 0 && ` · ${volumen} kg vol.`}
          </div>
        </div>
        <span className="text-slate-500">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-800 pt-3">
          {lastPrevSet && (
            <div className="text-xs text-slate-400 bg-slate-800 rounded-lg px-3 py-2">
              Última vez ({fmtDateShort(lastPrevSet.session.date)}):{' '}
              {lastPrevSet.allSets
                .map((s) => `${s.weight}×${s.reps}`)
                .join(', ')}
            </div>
          )}

          {exSets.length > 0 && (
            <div className="space-y-1">
              {exSets.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2 text-sm"
                >
                  <span className="text-slate-400">Set {i + 1}</span>
                  <span className="font-semibold">
                    {s.weight} kg × {s.reps} reps
                  </span>
                  <button
                    onClick={() => onRemoveSet(s.id)}
                    className="text-red-400 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400">Peso (kg)</label>
              <input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-800 rounded-lg px-3 py-2 text-lg font-semibold"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Reps</label>
              <input
                type="number"
                inputMode="numeric"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full bg-slate-800 rounded-lg px-3 py-2 text-lg font-semibold"
                placeholder="0"
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (!weight && !reps) return
              onAddSet(weight, reps)
            }}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-lg"
          >
            + Agregar set
          </button>
        </div>
      )}
    </div>
  )
}

function ExercisePicker({ catalog, excludeIds, onPick, onClose }) {
  const [filter, setFilter] = useState('')
  const [muscle, setMuscle] = useState('Todos')

  const options = catalog.filter((e) => {
    if (excludeIds.includes(e.id)) return false
    if (muscle !== 'Todos' && e.muscle !== muscle) return false
    if (filter && !e.name.toLowerCase().includes(filter.toLowerCase())) return false
    return true
  })

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-t-3xl w-full max-w-md max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-800 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Elegir ejercicio</h3>
            <button onClick={onClose} className="text-slate-400">
              ✕
            </button>
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-slate-800 rounded-lg px-3 py-2"
          />
          <div className="flex gap-1 overflow-x-auto pb-1">
            {['Todos', ...MUSCLES].map((m) => (
              <button
                key={m}
                onClick={() => setMuscle(m)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold ${
                  muscle === m
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {options.length === 0 && (
            <div className="p-6 text-center text-slate-500 text-sm">
              No hay ejercicios que coincidan.
            </div>
          )}
          {options.map((e) => (
            <button
              key={e.id}
              onClick={() => onPick(e.id)}
              className="w-full px-4 py-3 text-left border-b border-slate-800 hover:bg-slate-800"
            >
              <div className="font-semibold">{e.name}</div>
              <div className="text-xs text-slate-400">{e.muscle}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Sesión de cardio
// ============================================================

function CardioSession({ session, sessions, setSessions, onFinish, onDelete }) {
  const update = (patch) => {
    setSessions(sessions.map((s) => (s.id === session.id ? { ...s, ...patch } : s)))
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 rounded-2xl p-4 space-y-3">
        <div className="text-xs text-slate-400 uppercase tracking-wide">
          Sesión de cardio
        </div>
        <input
          type="date"
          value={session.date}
          onChange={(e) => update({ date: e.target.value })}
          className="w-full bg-slate-800 rounded-lg px-3 py-2"
        />
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 space-y-4">
        <div>
          <label className="text-xs text-slate-400">Tipo</label>
          <select
            value={session.cardioType}
            onChange={(e) => update({ cardioType: e.target.value })}
            className="w-full bg-slate-800 rounded-lg px-3 py-2 mt-1"
          >
            {CARDIO_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400">Duración (min)</label>
            <input
              type="number"
              inputMode="numeric"
              value={session.duration || ''}
              onChange={(e) => update({ duration: Number(e.target.value) || 0 })}
              className="w-full bg-slate-800 rounded-lg px-3 py-2 text-lg font-semibold mt-1"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Distancia (km)</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={session.distance || ''}
              onChange={(e) => update({ distance: Number(e.target.value) || 0 })}
              className="w-full bg-slate-800 rounded-lg px-3 py-2 text-lg font-semibold mt-1"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400">Notas (opcional)</label>
          <textarea
            value={session.notes || ''}
            onChange={(e) => update({ notes: e.target.value })}
            className="w-full bg-slate-800 rounded-lg px-3 py-2 mt-1"
            rows={2}
            placeholder="Cómo te fue, ritmo, etc."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4">
        <button
          onClick={onDelete}
          className="bg-slate-900 border border-red-900 text-red-400 py-3 rounded-xl font-semibold text-sm"
        >
          Descartar
        </button>
        <button
          onClick={onFinish}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3 rounded-xl font-bold"
        >
          Terminar sesión
        </button>
      </div>
    </div>
  )
}

// ============================================================
// TAB: HISTORIAL
// ============================================================

function TabHistorial({ catalog, sessions, sets, setSessions, setSets }) {
  const [openId, setOpenId] = useState(null)

  const sorted = [...sessions].sort((a, b) => (a.date < b.date ? 1 : -1))

  if (sorted.length === 0) {
    return (
      <div className="text-slate-400 text-sm text-center py-12">
        Todavía no hay sesiones. Arrancá una en la pestaña "Hoy".
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sorted.map((session) => {
        const sessionSets = sets.filter((s) => s.sessionId === session.id)
        const exercisesUsed = [...new Set(sessionSets.map((s) => s.exerciseId))]
        const totalVolume = sessionSets.reduce(
          (acc, s) => acc + s.weight * s.reps,
          0
        )
        const isOpen = openId === session.id
        return (
          <div key={session.id} className="bg-slate-900 rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenId(isOpen ? null : session.id)}
              className="w-full px-4 py-3 flex items-center justify-between"
            >
              <div className="text-left">
                <div className="font-semibold">{fmtDate(session.date)}</div>
                <div className="text-xs text-slate-400">
                  {session.kind === 'strength'
                    ? `Fuerza · ${exercisesUsed.length} ejercicios · ${totalVolume} kg vol.`
                    : `Cardio · ${session.cardioType} · ${session.duration || 0} min${
                        session.distance ? ` · ${session.distance} km` : ''
                      }`}
                </div>
              </div>
              <span className="text-slate-500">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="border-t border-slate-800 p-4 space-y-3">
                {session.kind === 'strength' && (
                  <>
                    {exercisesUsed.map((exId) => {
                      const ex = catalog.find((e) => e.id === exId)
                      const exSets = sessionSets.filter((s) => s.exerciseId === exId)
                      return (
                        <div key={exId} className="text-sm">
                          <div className="font-semibold">
                            {ex?.name || '(eliminado)'}
                          </div>
                          <div className="text-slate-400 text-xs">
                            {exSets
                              .map((s) => `${s.weight}×${s.reps}`)
                              .join(', ')}
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
                {session.kind === 'cardio' && (
                  <div className="text-sm text-slate-300">
                    <div>Tipo: {session.cardioType}</div>
                    <div>Duración: {session.duration || 0} min</div>
                    {session.distance > 0 && <div>Distancia: {session.distance} km</div>}
                    {session.notes && (
                      <div className="mt-2 text-slate-400">{session.notes}</div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => {
                    if (!confirm('¿Eliminar esta sesión?')) return
                    setSessions(sessions.filter((s) => s.id !== session.id))
                    setSets(sets.filter((s) => s.sessionId !== session.id))
                  }}
                  className="text-xs text-red-400 border border-red-900 rounded-lg px-3 py-1"
                >
                  Eliminar sesión
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================
// TAB: PROGRESO
// ============================================================

function TabProgreso({ catalog, sessions, sets }) {
  const [mode, setMode] = useState('strength') // strength | cardio
  const [selectedId, setSelectedId] = useState(null)
  const [cardioMetric, setCardioMetric] = useState('duration')

  // Fuerza: agrupar por sesión + ejercicio -> volumen total
  const strengthSeries = useMemo(() => {
    if (!selectedId) return []
    const points = []
    for (const session of sessions) {
      if (session.kind !== 'strength') continue
      const exSets = sets.filter(
        (s) => s.sessionId === session.id && s.exerciseId === selectedId
      )
      if (exSets.length === 0) continue
      const volumen = exSets.reduce((acc, s) => acc + s.weight * s.reps, 0)
      const maxWeight = Math.max(...exSets.map((s) => s.weight))
      points.push({ date: session.date, volumen, maxWeight, sets: exSets.length })
    }
    return points.sort((a, b) => (a.date < b.date ? -1 : 1))
  }, [selectedId, sessions, sets])

  // Cardio: agrupar por sesión, según tipo
  const cardioSeries = useMemo(() => {
    if (!selectedId) return []
    return sessions
      .filter((s) => s.kind === 'cardio' && s.cardioType === selectedId)
      .map((s) => ({
        date: s.date,
        duration: s.duration || 0,
        distance: s.distance || 0,
      }))
      .sort((a, b) => (a.date < b.date ? -1 : 1))
  }, [selectedId, sessions])

  const usedExercises = useMemo(() => {
    const ids = [...new Set(sets.map((s) => s.exerciseId))]
    return catalog.filter((e) => ids.includes(e.id))
  }, [catalog, sets])

  const usedCardioTypes = useMemo(() => {
    return [
      ...new Set(
        sessions.filter((s) => s.kind === 'cardio').map((s) => s.cardioType)
      ),
    ]
  }, [sessions])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => {
            setMode('strength')
            setSelectedId(null)
          }}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
            mode === 'strength'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-900 text-slate-300'
          }`}
        >
          Fuerza
        </button>
        <button
          onClick={() => {
            setMode('cardio')
            setSelectedId(null)
          }}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
            mode === 'cardio'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-900 text-slate-300'
          }`}
        >
          Cardio
        </button>
      </div>

      {mode === 'strength' && (
        <>
          <select
            value={selectedId || ''}
            onChange={(e) => setSelectedId(e.target.value || null)}
            className="w-full bg-slate-900 rounded-xl px-3 py-3"
          >
            <option value="">Elegí un ejercicio...</option>
            {usedExercises.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.muscle})
              </option>
            ))}
          </select>

          {selectedId && strengthSeries.length > 0 && (
            <>
              <ProgressChart
                data={strengthSeries}
                valueKey="volumen"
                label="Volumen total (kg)"
              />
              <div className="bg-slate-900 rounded-2xl p-4">
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
                  Últimas sesiones
                </div>
                {[...strengthSeries].reverse().slice(0, 6).map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0 text-sm"
                  >
                    <span className="text-slate-400">{fmtDate(p.date)}</span>
                    <span>
                      <span className="text-slate-500">{p.sets} sets · </span>
                      <span className="font-semibold text-emerald-400">
                        {p.volumen} kg vol.
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
          {selectedId && strengthSeries.length === 0 && (
            <div className="text-slate-400 text-sm text-center py-8">
              Sin datos para este ejercicio.
            </div>
          )}
        </>
      )}

      {mode === 'cardio' && (
        <>
          <select
            value={selectedId || ''}
            onChange={(e) => setSelectedId(e.target.value || null)}
            className="w-full bg-slate-900 rounded-xl px-3 py-3"
          >
            <option value="">Elegí un tipo de cardio...</option>
            {usedCardioTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {selectedId && (
            <div className="flex gap-2">
              <button
                onClick={() => setCardioMetric('duration')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold ${
                  cardioMetric === 'duration'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300'
                }`}
              >
                Duración
              </button>
              <button
                onClick={() => setCardioMetric('distance')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold ${
                  cardioMetric === 'distance'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300'
                }`}
              >
                Distancia
              </button>
            </div>
          )}
          {selectedId && cardioSeries.length > 0 && (
            <>
              <ProgressChart
                data={cardioSeries}
                valueKey={cardioMetric}
                label={
                  cardioMetric === 'duration' ? 'Duración (min)' : 'Distancia (km)'
                }
              />
              <div className="bg-slate-900 rounded-2xl p-4">
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
                  Últimas sesiones
                </div>
                {[...cardioSeries].reverse().slice(0, 6).map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0 text-sm"
                  >
                    <span className="text-slate-400">{fmtDate(p.date)}</span>
                    <span className="font-semibold text-emerald-400">
                      {p.duration} min{p.distance > 0 && ` · ${p.distance} km`}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
          {selectedId && cardioSeries.length === 0 && (
            <div className="text-slate-400 text-sm text-center py-8">
              Sin datos para este tipo.
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ProgressChart({ data, valueKey, label }) {
  if (!data || data.length === 0) return null

  const values = data.map((d) => d[valueKey])
  const max = Math.max(...values) || 1
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const W = 320
  const H = 180
  const pad = 20
  const stepX = (W - pad * 2) / Math.max(data.length - 1, 1)

  const points = data.map((d, i) => {
    const x = pad + i * stepX
    const y = H - pad - ((d[valueKey] - min) / range) * (H - pad * 2)
    return { x, y, v: d[valueKey], date: d.date }
  })

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')

  const maxIdx = values.indexOf(max)

  return (
    <div className="bg-slate-900 rounded-2xl p-4">
      <div className="flex justify-between items-baseline mb-2">
        <div className="text-xs text-slate-400 uppercase tracking-wide">{label}</div>
        <div className="text-sm">
          <span className="text-slate-400">Máx:</span>{' '}
          <span className="font-bold text-emerald-400">{max}</span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        {/* Línea */}
        <path
          d={path}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Puntos */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === maxIdx ? 5 : 3}
            fill={i === maxIdx ? '#fbbf24' : '#10b981'}
          />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-slate-500 mt-2">
        <span>{fmtDateShort(data[0].date)}</span>
        <span>{fmtDateShort(data[data.length - 1].date)}</span>
      </div>
    </div>
  )
}

// ============================================================
// TAB: DATOS
// ============================================================

function TabDatos({
  catalog,
  setCatalog,
  sessions,
  sets,
  setSessions,
  setSets,
  setActiveSessionId,
}) {
  const [newName, setNewName] = useState('')
  const [newMuscle, setNewMuscle] = useState(MUSCLES[0])
  const [importText, setImportText] = useState('')
  const [showImport, setShowImport] = useState(false)

  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      catalog,
      sessions,
      sets,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gym-agustin-${todayISO()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = () => {
    try {
      const data = JSON.parse(importText)
      if (!data.catalog || !data.sessions || !data.sets) {
        alert('El archivo no tiene el formato esperado.')
        return
      }
      if (!confirm('Esto reemplaza todos tus datos actuales. ¿Seguro?')) return
      setCatalog(data.catalog)
      setSessions(data.sessions)
      setSets(data.sets)
      setActiveSessionId(null)
      setImportText('')
      setShowImport(false)
      alert('Datos importados.')
    } catch (e) {
      alert('No pude leer el JSON: ' + e.message)
    }
  }

  const addExercise = () => {
    if (!newName.trim()) return
    setCatalog([...catalog, { id: uid(), name: newName.trim(), muscle: newMuscle }])
    setNewName('')
  }

  const removeExercise = (id) => {
    const usedInSets = sets.some((s) => s.exerciseId === id)
    if (usedInSets) {
      if (!confirm('Este ejercicio tiene sets registrados. ¿Eliminarlo igual?')) return
    }
    setCatalog(catalog.filter((e) => e.id !== id))
  }

  const grouped = MUSCLES.map((m) => ({
    muscle: m,
    items: catalog.filter((e) => e.muscle === m),
  }))

  return (
    <div className="space-y-6">
      {/* Backup */}
      <section className="bg-slate-900 rounded-2xl p-4 space-y-3">
        <h2 className="font-bold">Backup</h2>
        <p className="text-xs text-slate-400">
          Guardá una copia periódica. Los datos viven solo en este dispositivo.
        </p>
        <button
          onClick={exportData}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl"
        >
          Exportar JSON
        </button>
        <button
          onClick={() => setShowImport(!showImport)}
          className="w-full bg-slate-800 py-2 rounded-lg text-sm"
        >
          {showImport ? 'Cancelar' : 'Importar JSON'}
        </button>
        {showImport && (
          <div className="space-y-2">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Pegá acá el contenido del JSON..."
              className="w-full bg-slate-800 rounded-lg px-3 py-2 text-xs"
              rows={4}
            />
            <button
              onClick={importData}
              className="w-full bg-red-600 py-2 rounded-lg font-semibold text-sm"
            >
              Reemplazar todos los datos
            </button>
          </div>
        )}
      </section>

      {/* Estadísticas */}
      <section className="bg-slate-900 rounded-2xl p-4">
        <h2 className="font-bold mb-3">Estadísticas</h2>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-2xl font-bold text-emerald-400">
              {sessions.length}
            </div>
            <div className="text-xs text-slate-400">Sesiones</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">{sets.length}</div>
            <div className="text-xs text-slate-400">Sets</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">{catalog.length}</div>
            <div className="text-xs text-slate-400">Ejercicios</div>
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section className="bg-slate-900 rounded-2xl p-4 space-y-3">
        <h2 className="font-bold">Catálogo de ejercicios</h2>

        <div className="space-y-2 border-b border-slate-800 pb-3">
          <input
            type="text"
            placeholder="Nombre del ejercicio"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-slate-800 rounded-lg px-3 py-2"
          />
          <div className="flex gap-2">
            <select
              value={newMuscle}
              onChange={(e) => setNewMuscle(e.target.value)}
              className="flex-1 bg-slate-800 rounded-lg px-3 py-2"
            >
              {MUSCLES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <button
              onClick={addExercise}
              className="bg-emerald-500 text-slate-950 font-bold px-4 rounded-lg"
            >
              +
            </button>
          </div>
        </div>

        {grouped.map((g) => (
          <div key={g.muscle}>
            <div className="text-xs text-slate-400 uppercase tracking-wide mt-2 mb-1">
              {g.muscle}
            </div>
            {g.items.length === 0 && (
              <div className="text-xs text-slate-600 italic">Vacío</div>
            )}
            {g.items.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between py-1.5 text-sm"
              >
                <span>{e.name}</span>
                <button
                  onClick={() => removeExercise(e.id)}
                  className="text-red-400 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ))}
      </section>

      <div className="text-center text-xs text-slate-600 py-4">
        Gym Agustín · v1.0
      </div>
    </div>
  )
}
