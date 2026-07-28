import { useState, useEffect, useMemo } from 'react'

// ============================================================
// Constantes
// ============================================================

const STORAGE_KEY = 'gym_v1'

const MUSCLES = ['Pecho', 'Hombros', 'Tríceps', 'Espalda', 'Bíceps', 'Piernas']

const DEFAULT_EXERCISES = [
  // Pecho
  { id: 'e1', name: 'Press banca plano con barra', muscle: 'Pecho' },
  { id: 'e22', name: 'Press banca plano con mancuernas', muscle: 'Pecho' },
  { id: 'e19', name: 'Press banca inclinado con barra', muscle: 'Pecho' },
  { id: 'e20', name: 'Press banca inclinado con mancuernas', muscle: 'Pecho' },
  { id: 'e21', name: 'Press banca declinado', muscle: 'Pecho' },
  { id: 'e27', name: 'Press en máquina', muscle: 'Pecho' },
  { id: 'e2', name: 'Aperturas con mancuernas', muscle: 'Pecho' },
  { id: 'e23', name: 'Aperturas inclinadas con mancuernas', muscle: 'Pecho' },
  { id: 'e24', name: 'Aperturas en máquina (peck deck)', muscle: 'Pecho' },
  { id: 'e25', name: 'Cruces en polea alta', muscle: 'Pecho' },
  { id: 'e26', name: 'Cruces en polea baja', muscle: 'Pecho' },

  // Hombros
  { id: 'e3', name: 'Press militar con barra', muscle: 'Hombros' },
  { id: 'e28', name: 'Press militar con mancuernas', muscle: 'Hombros' },
  { id: 'e29', name: 'Press Arnold', muscle: 'Hombros' },
  { id: 'e4', name: 'Elevaciones laterales con mancuernas', muscle: 'Hombros' },
  { id: 'e30', name: 'Elevaciones laterales en polea', muscle: 'Hombros' },
  { id: 'e31', name: 'Elevaciones frontales', muscle: 'Hombros' },
  { id: 'e32', name: 'Pájaros (posteriores) con mancuernas', muscle: 'Hombros' },
  { id: 'e33', name: 'Face pull', muscle: 'Hombros' },
  { id: 'e34', name: 'Encogimientos (trapecio)', muscle: 'Hombros' },

  // Tríceps
  { id: 'e5', name: 'Fondos en paralelas', muscle: 'Tríceps' },
  { id: 'e38', name: 'Fondos en banco', muscle: 'Tríceps' },
  { id: 'e6', name: 'Extensión en polea con cuerda', muscle: 'Tríceps' },
  { id: 'e58', name: 'Extensión en polea con barra', muscle: 'Tríceps' },
  { id: 'e35', name: 'Press francés', muscle: 'Tríceps' },
  { id: 'e36', name: 'Copa (extensión con mancuerna arriba)', muscle: 'Tríceps' },
  { id: 'e37', name: 'Patada de tríceps', muscle: 'Tríceps' },

  // Espalda
  { id: 'e7', name: 'Dominadas (prono)', muscle: 'Espalda' },
  { id: 'e39', name: 'Dominadas supino (chin-ups)', muscle: 'Espalda' },
  { id: 'e10', name: 'Jalón al pecho (agarre ancho)', muscle: 'Espalda' },
  { id: 'e40', name: 'Jalón agarre cerrado', muscle: 'Espalda' },
  { id: 'e8', name: 'Remo con barra', muscle: 'Espalda' },
  { id: 'e42', name: 'Remo tipo T', muscle: 'Espalda' },
  { id: 'e41', name: 'Remo en polea baja', muscle: 'Espalda' },
  { id: 'e9', name: 'Remo con mancuerna (una mano)', muscle: 'Espalda' },
  { id: 'e59', name: 'Remo en máquina', muscle: 'Espalda' },
  { id: 'e43', name: 'Peso muerto convencional', muscle: 'Espalda' },
  { id: 'e44', name: 'Pull-over', muscle: 'Espalda' },

  // Bíceps
  { id: 'e11', name: 'Curl con barra', muscle: 'Bíceps' },
  { id: 'e60', name: 'Curl con barra Z', muscle: 'Bíceps' },
  { id: 'e45', name: 'Curl con mancuernas (alterno)', muscle: 'Bíceps' },
  { id: 'e12', name: 'Curl martillo', muscle: 'Bíceps' },
  { id: 'e46', name: 'Curl concentrado', muscle: 'Bíceps' },
  { id: 'e47', name: 'Curl en banco Scott (predicador)', muscle: 'Bíceps' },
  { id: 'e48', name: 'Curl en polea', muscle: 'Bíceps' },

  // Piernas
  { id: 'e13', name: 'Sentadilla libre (con barra)', muscle: 'Piernas' },
  { id: 'e50', name: 'Sentadilla frontal', muscle: 'Piernas' },
  { id: 'e49', name: 'Sentadilla búlgara', muscle: 'Piernas' },
  { id: 'e14', name: 'Prensa', muscle: 'Piernas' },
  { id: 'e51', name: 'Zancadas (lunges)', muscle: 'Piernas' },
  { id: 'e15', name: 'Extensión de cuádriceps', muscle: 'Piernas' },
  { id: 'e16', name: 'Curl femoral acostado', muscle: 'Piernas' },
  { id: 'e53', name: 'Curl femoral sentado', muscle: 'Piernas' },
  { id: 'e17', name: 'Peso muerto rumano', muscle: 'Piernas' },
  { id: 'e57', name: 'Peso muerto sumo', muscle: 'Piernas' },
  { id: 'e52', name: 'Hip thrust', muscle: 'Piernas' },
  { id: 'e55', name: 'Abductores en máquina', muscle: 'Piernas' },
  { id: 'e56', name: 'Aductores en máquina', muscle: 'Piernas' },
  { id: 'e18', name: 'Gemelos de pie', muscle: 'Piernas' },
  { id: 'e54', name: 'Gemelos sentado', muscle: 'Piernas' },
]

const CARDIO_TYPES = ['Correr', 'Bicicleta', 'Elíptica', 'Cinta', 'Caminata', 'Escalador', 'Otro']

const DEFAULT_FOOD_GOALS = [
  { id: 'g1', label: 'Cumplí proteína objetivo', active: true },
  { id: 'g2', label: 'Verduras en al menos 2 comidas', active: true },
  { id: 'g3', label: 'Sin ultraprocesados / comida basura', active: true },
  { id: 'g4', label: '2 litros de agua', active: true },
  { id: 'g5', label: 'No comí después de las 22 hs', active: true },
]

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

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
  const [foodGoals, setFoodGoals] = useState(DEFAULT_FOOD_GOALS)
  const [foodDays, setFoodDays] = useState([]) // {date, checks: {goalId: bool}, notes}
  const [bodyWeights, setBodyWeights] = useState([]) // {id, date, weight}
  const [loaded, setLoaded] = useState(false)

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const s = loadState()
    if (s) {
      if (s.catalog) {
        // Merge: agregar ejercicios default que aún no estén en el catálogo del usuario
        const existingIds = new Set(s.catalog.map((e) => e.id))
        const newOnes = DEFAULT_EXERCISES.filter((e) => !existingIds.has(e.id))
        setCatalog(newOnes.length > 0 ? [...s.catalog, ...newOnes] : s.catalog)
      }
      if (s.sessions) setSessions(s.sessions)
      if (s.sets) setSets(s.sets)
      if (s.activeSessionId) setActiveSessionId(s.activeSessionId)
      if (s.foodGoals) {
        // Merge de goals default nuevos también
        const existingGoalIds = new Set(s.foodGoals.map((g) => g.id))
        const newGoals = DEFAULT_FOOD_GOALS.filter((g) => !existingGoalIds.has(g.id))
        setFoodGoals(newGoals.length > 0 ? [...s.foodGoals, ...newGoals] : s.foodGoals)
      }
      if (s.foodDays) setFoodDays(s.foodDays)
      if (s.bodyWeights) setBodyWeights(s.bodyWeights)
    }
    setLoaded(true)
  }, [])

  // Persistir cada vez que cambia el estado
  useEffect(() => {
    if (!loaded) return
    saveState({
      catalog,
      sessions,
      sets,
      activeSessionId,
      foodGoals,
      foodDays,
      bodyWeights,
    })
  }, [
    catalog,
    sessions,
    sets,
    activeSessionId,
    foodGoals,
    foodDays,
    bodyWeights,
    loaded,
  ])

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
        {tab === 'comida' && (
          <TabComida
            foodGoals={foodGoals}
            foodDays={foodDays}
            setFoodDays={setFoodDays}
            bodyWeights={bodyWeights}
            setBodyWeights={setBodyWeights}
          />
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
            foodGoals={foodGoals}
            setFoodGoals={setFoodGoals}
            foodDays={foodDays}
            setFoodDays={setFoodDays}
            bodyWeights={bodyWeights}
            setBodyWeights={setBodyWeights}
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
    { id: 'comida', label: 'Comida', icon: '🍎' },
    { id: 'datos', label: 'Datos', icon: '⚙️' },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800">
      <div className="max-w-md mx-auto grid grid-cols-5">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className={`py-3 flex flex-col items-center gap-1 text-[11px] transition-colors ${
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
  const pendingExercises = session.pendingExerciseIds || []

  // Ejercicios que ya tienen sets en esta sesión, en orden de primera aparición
  const exercisesWithSets = useMemo(() => {
    const seen = []
    for (const s of sessionSets) {
      if (!seen.includes(s.exerciseId)) seen.push(s.exerciseId)
    }
    return seen
  }, [sessionSets])

  // Combinamos: los que ya tienen sets + los pendientes que aún no tienen sets
  const exercisesInSession = useMemo(() => {
    const result = [...exercisesWithSets]
    for (const id of pendingExercises) {
      if (!result.includes(id)) result.push(id)
    }
    return result
  }, [exercisesWithSets, pendingExercises])

  const updateSession = (patch) => {
    setSessions(sessions.map((s) => (s.id === session.id ? { ...s, ...patch } : s)))
  }

  const addExercise = (exerciseId) => {
    setPickerOpen(false)
    if (
      !exercisesWithSets.includes(exerciseId) &&
      !pendingExercises.includes(exerciseId)
    ) {
      updateSession({ pendingExerciseIds: [...pendingExercises, exerciseId] })
    }
    setExerciseOpen(exerciseId)
  }

  const addSet = (exerciseId, weight, reps, howMany = 1) => {
    const already = sessionSets.filter((s) => s.exerciseId === exerciseId).length
    const n = Math.max(1, Math.min(20, Math.floor(Number(howMany) || 1)))
    const newSets = []
    for (let i = 0; i < n; i++) {
      newSets.push({
        id: uid(),
        sessionId: session.id,
        exerciseId,
        order: already + i + 1,
        weight: Number(weight) || 0,
        reps: Number(reps) || 0,
      })
    }
    setSets([...sets, ...newSets])
    // Ya no está pendiente, tiene sets
    if (pendingExercises.includes(exerciseId)) {
      updateSession({
        pendingExerciseIds: pendingExercises.filter((id) => id !== exerciseId),
      })
    }
  }

  const removeSet = (setId) => {
    setSets(sets.filter((s) => s.id !== setId))
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
  const [series, setSeries] = useState('1')

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

          <div className="grid grid-cols-3 gap-2">
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
            <div>
              <label className="text-xs text-slate-400">Series</label>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                max="20"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                className="w-full bg-slate-800 rounded-lg px-3 py-2 text-lg font-semibold"
                placeholder="1"
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (!weight && !reps) return
              const n = Math.max(1, Math.floor(Number(series) || 1))
              onAddSet(weight, reps, n)
              setSeries('1')
            }}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-lg"
          >
            {Number(series) > 1
              ? `+ Agregar ${Math.floor(Number(series))} series`
              : '+ Agregar set'}
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

  // Músculo: por sesión, sumar volumen de TODOS los ejercicios de ese grupo
  const muscleSeries = useMemo(() => {
    if (!selectedId || mode !== 'muscle') return []
    const exIds = catalog
      .filter((e) => e.muscle === selectedId)
      .map((e) => e.id)
    const points = []
    for (const session of sessions) {
      if (session.kind !== 'strength') continue
      const relevantSets = sets.filter(
        (s) => s.sessionId === session.id && exIds.includes(s.exerciseId)
      )
      if (relevantSets.length === 0) continue
      const volumen = relevantSets.reduce(
        (acc, s) => acc + s.weight * s.reps,
        0
      )
      const exercisesUsed = new Set(relevantSets.map((s) => s.exerciseId)).size
      points.push({
        date: session.date,
        volumen,
        sets: relevantSets.length,
        exercises: exercisesUsed,
      })
    }
    return points.sort((a, b) => (a.date < b.date ? -1 : 1))
  }, [selectedId, mode, sessions, sets, catalog])

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
          className={`flex-1 py-2 rounded-lg text-xs font-semibold ${
            mode === 'strength'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-900 text-slate-300'
          }`}
        >
          Ejercicio
        </button>
        <button
          onClick={() => {
            setMode('muscle')
            setSelectedId(null)
          }}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold ${
            mode === 'muscle'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-900 text-slate-300'
          }`}
        >
          Músculo
        </button>
        <button
          onClick={() => {
            setMode('cardio')
            setSelectedId(null)
          }}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold ${
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

      {mode === 'muscle' && (
        <>
          <select
            value={selectedId || ''}
            onChange={(e) => setSelectedId(e.target.value || null)}
            className="w-full bg-slate-900 rounded-xl px-3 py-3"
          >
            <option value="">Elegí un músculo...</option>
            {MUSCLES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {selectedId && muscleSeries.length > 0 && (
            <>
              <ProgressChart
                data={muscleSeries}
                valueKey="volumen"
                label={`Volumen ${selectedId} (kg)`}
              />
              <div className="bg-slate-900 rounded-2xl p-4">
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
                  Últimas sesiones
                </div>
                {[...muscleSeries].reverse().slice(0, 6).map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0 text-sm"
                  >
                    <span className="text-slate-400">{fmtDate(p.date)}</span>
                    <span>
                      <span className="text-slate-500">
                        {p.exercises} ej · {p.sets} sets ·{' '}
                      </span>
                      <span className="font-semibold text-emerald-400">
                        {p.volumen} kg
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
          {selectedId && muscleSeries.length === 0 && (
            <div className="text-slate-400 text-sm text-center py-8">
              Sin datos para {selectedId}.
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
// TAB: COMIDA
// ============================================================

function TabComida({
  foodGoals,
  foodDays,
  setFoodDays,
  bodyWeights,
  setBodyWeights,
}) {
  const [currentDate, setCurrentDate] = useState(todayISO())
  const [view, setView] = useState('calendario') // calendario | peso

  const activeGoals = foodGoals.filter((g) => g.active)
  const dayRecord = foodDays.find((d) => d.date === currentDate)

  const checks = dayRecord?.checks || {}
  const notes = dayRecord?.notes || ''

  const toggleCheck = (goalId) => {
    const existing = foodDays.find((d) => d.date === currentDate)
    if (existing) {
      setFoodDays(
        foodDays.map((d) =>
          d.date === currentDate
            ? { ...d, checks: { ...d.checks, [goalId]: !d.checks?.[goalId] } }
            : d
        )
      )
    } else {
      setFoodDays([
        ...foodDays,
        { date: currentDate, checks: { [goalId]: true }, notes: '' },
      ])
    }
  }

  const updateNotes = (newNotes) => {
    const existing = foodDays.find((d) => d.date === currentDate)
    if (existing) {
      setFoodDays(
        foodDays.map((d) =>
          d.date === currentDate ? { ...d, notes: newNotes } : d
        )
      )
    } else {
      setFoodDays([
        ...foodDays,
        { date: currentDate, checks: {}, notes: newNotes },
      ])
    }
  }

  const shiftDay = (delta) => {
    const [y, m, d] = currentDate.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    date.setDate(date.getDate() + delta)
    const off = date.getTimezoneOffset()
    const iso = new Date(date.getTime() - off * 60000).toISOString().slice(0, 10)
    setCurrentDate(iso)
  }

  const completedCount = activeGoals.filter((g) => checks[g.id]).length
  const total = activeGoals.length
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Navegador de día */}
      <div className="bg-slate-900 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => shiftDay(-1)}
            className="bg-slate-800 w-10 h-10 rounded-lg text-lg"
          >
            ‹
          </button>
          <input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            className="flex-1 bg-slate-800 rounded-lg px-3 py-2 text-center"
          />
          <button
            onClick={() => shiftDay(1)}
            className="bg-slate-800 w-10 h-10 rounded-lg text-lg"
          >
            ›
          </button>
        </div>
        {currentDate !== todayISO() && (
          <button
            onClick={() => setCurrentDate(todayISO())}
            className="w-full bg-slate-800 rounded-lg py-1.5 text-xs text-slate-400"
          >
            Volver a hoy
          </button>
        )}
        {total > 0 && (
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-slate-400 uppercase tracking-wide">
              Adherencia
            </div>
            <div className={`text-2xl font-bold ${adherenceColor(pct)}`}>
              {pct}%{' '}
              <span className="text-xs font-normal text-slate-500">
                ({completedCount}/{total})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Checks del día */}
      <div className="bg-slate-900 rounded-2xl p-4 space-y-2">
        <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
          Objetivos del día
        </div>
        {activeGoals.length === 0 && (
          <div className="text-slate-500 text-sm text-center py-3">
            No hay objetivos activos. Agregalos en la pestaña Datos.
          </div>
        )}
        {activeGoals.map((g) => (
          <button
            key={g.id}
            onClick={() => toggleCheck(g.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
              checks[g.id]
                ? 'bg-emerald-500/20 border border-emerald-500/40'
                : 'bg-slate-800 border border-transparent'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                checks[g.id]
                  ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                  : 'border-slate-600'
              }`}
            >
              {checks[g.id] && '✓'}
            </div>
            <span
              className={`text-sm text-left ${
                checks[g.id] ? 'text-slate-100' : 'text-slate-300'
              }`}
            >
              {g.label}
            </span>
          </button>
        ))}
      </div>

      {/* Notas */}
      <div className="bg-slate-900 rounded-2xl p-4">
        <label className="text-xs text-slate-400 uppercase tracking-wide">
          Notas del día
        </label>
        <textarea
          value={notes}
          onChange={(e) => updateNotes(e.target.value)}
          placeholder="Ej: cumpleaños, salida, contexto..."
          className="w-full bg-slate-800 rounded-lg px-3 py-2 mt-2 text-sm"
          rows={2}
        />
      </div>

      {/* Toggle Calendario / Peso */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => setView('calendario')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
            view === 'calendario'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-900 text-slate-300'
          }`}
        >
          Calendario
        </button>
        <button
          onClick={() => setView('peso')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
            view === 'peso'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-900 text-slate-300'
          }`}
        >
          Peso
        </button>
      </div>

      {view === 'calendario' && (
        <CalendarioComida
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          foodDays={foodDays}
          activeGoals={activeGoals}
        />
      )}
      {view === 'peso' && (
        <PesoCorporal
          bodyWeights={bodyWeights}
          setBodyWeights={setBodyWeights}
        />
      )}
    </div>
  )
}

function adherenceColor(pct) {
  if (pct >= 80) return 'text-emerald-400'
  if (pct >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

function adherenceBg(pct) {
  if (pct >= 80) return 'bg-emerald-500/70'
  if (pct >= 50) return 'bg-yellow-500/60'
  if (pct > 0) return 'bg-red-500/60'
  return 'bg-slate-800'
}

function computeAdherence(dayRecord, activeGoals) {
  if (!dayRecord || activeGoals.length === 0) return null
  const done = activeGoals.filter((g) => dayRecord.checks?.[g.id]).length
  return Math.round((done / activeGoals.length) * 100)
}

// ============================================================
// Calendario mensual
// ============================================================

function CalendarioComida({ currentDate, setCurrentDate, foodDays, activeGoals }) {
  const [year, setYear] = useState(() => Number(currentDate.split('-')[0]))
  const [month, setMonth] = useState(() => Number(currentDate.split('-')[1]) - 1) // 0-11

  const shiftMonth = (delta) => {
    let m = month + delta
    let y = year
    if (m < 0) {
      m = 11
      y -= 1
    } else if (m > 11) {
      m = 0
      y += 1
    }
    setMonth(m)
    setYear(y)
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayJs = new Date(year, month, 1).getDay() // 0=Domingo
  const firstDayMonBased = (firstDayJs + 6) % 7 // 0=Lunes

  // Adherencia mensual promedio
  const monthDays = foodDays.filter((d) => {
    const [y, m] = d.date.split('-').map(Number)
    return y === year && m - 1 === month
  })
  const monthAvg = useMemo(() => {
    if (monthDays.length === 0 || activeGoals.length === 0) return null
    const total = monthDays.reduce(
      (acc, d) => acc + (computeAdherence(d, activeGoals) || 0),
      0
    )
    return Math.round(total / monthDays.length)
  }, [monthDays, activeGoals])

  const cells = []
  for (let i = 0; i < firstDayMonBased; i++) {
    cells.push({ empty: true, key: `e${i}` })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const record = foodDays.find((x) => x.date === iso)
    const pct = computeAdherence(record, activeGoals)
    cells.push({
      day: d,
      iso,
      pct,
      hasNotes: record?.notes?.length > 0,
      isSelected: iso === currentDate,
      isToday: iso === todayISO(),
      key: iso,
    })
  }

  return (
    <div className="bg-slate-900 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => shiftMonth(-1)}
          className="bg-slate-800 w-8 h-8 rounded-lg"
        >
          ‹
        </button>
        <div className="text-center">
          <div className="font-bold">
            {MONTH_NAMES[month]} {year}
          </div>
          {monthAvg !== null && (
            <div className={`text-xs ${adherenceColor(monthAvg)}`}>
              Promedio: {monthAvg}% ({monthDays.length}{' '}
              {monthDays.length === 1 ? 'día' : 'días'})
            </div>
          )}
        </div>
        <button
          onClick={() => shiftMonth(1)}
          className="bg-slate-800 w-8 h-8 rounded-lg"
        >
          ›
        </button>
      </div>

      {/* Labels de días de la semana */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
        {WEEKDAY_LABELS.map((w, i) => (
          <div key={i}>{w}</div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c) => {
          if (c.empty) return <div key={c.key} />
          return (
            <button
              key={c.key}
              onClick={() => setCurrentDate(c.iso)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative ${
                c.pct !== null ? adherenceBg(c.pct) : 'bg-slate-800'
              } ${
                c.isSelected
                  ? 'ring-2 ring-emerald-400'
                  : c.isToday
                    ? 'ring-1 ring-slate-500'
                    : ''
              }`}
            >
              <span className="font-semibold">{c.day}</span>
              {c.pct !== null && (
                <span className="text-[9px] opacity-90">{c.pct}%</span>
              )}
              {c.hasNotes && (
                <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-slate-100" />
              )}
            </button>
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-around text-[10px] text-slate-500 pt-2 border-t border-slate-800">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-emerald-500/70" /> 80-100%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-yellow-500/60" /> 50-79%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500/60" /> &lt; 50%
        </span>
      </div>
    </div>
  )
}

// ============================================================
// Peso corporal
// ============================================================

function PesoCorporal({ bodyWeights, setBodyWeights }) {
  const [newDate, setNewDate] = useState(todayISO())
  const [newWeight, setNewWeight] = useState('')

  const sorted = [...bodyWeights].sort((a, b) => (a.date < b.date ? -1 : 1))
  const lastEntry = sorted.length > 0 ? sorted[sorted.length - 1] : null

  const addEntry = () => {
    const w = Number(newWeight)
    if (!w || w <= 0) return
    // Si ya hay una entrada para esta fecha, la reemplaza
    const filtered = bodyWeights.filter((b) => b.date !== newDate)
    setBodyWeights([...filtered, { id: uid(), date: newDate, weight: w }])
    setNewWeight('')
  }

  const removeEntry = (id) => {
    setBodyWeights(bodyWeights.filter((b) => b.id !== id))
  }

  // Stats de tendencia
  const trend = useMemo(() => {
    if (sorted.length < 2) return null
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    const diff = last.weight - first.weight
    return { first, last, diff }
  }, [sorted])

  const chartData = sorted.map((b) => ({ date: b.date, weight: b.weight }))

  return (
    <div className="space-y-3">
      {/* Input rápido */}
      <div className="bg-slate-900 rounded-2xl p-4 space-y-3">
        <div className="text-xs text-slate-400 uppercase tracking-wide">
          Registrar peso
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500">Fecha</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full bg-slate-800 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Peso (kg)</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder={lastEntry ? String(lastEntry.weight) : '0.0'}
              className="w-full bg-slate-800 rounded-lg px-3 py-2 mt-1 text-lg font-semibold"
            />
          </div>
        </div>
        <button
          onClick={addEntry}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg"
        >
          Guardar
        </button>
      </div>

      {/* Resumen */}
      {lastEntry && (
        <div className="bg-slate-900 rounded-2xl p-4 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-slate-400">Último</div>
            <div className="text-2xl font-bold text-emerald-400">
              {lastEntry.weight} kg
            </div>
            <div className="text-xs text-slate-500">{fmtDate(lastEntry.date)}</div>
          </div>
          {trend && (
            <div>
              <div className="text-xs text-slate-400">Desde el inicio</div>
              <div
                className={`text-2xl font-bold ${
                  trend.diff > 0
                    ? 'text-yellow-400'
                    : trend.diff < 0
                      ? 'text-emerald-400'
                      : 'text-slate-300'
                }`}
              >
                {trend.diff > 0 ? '+' : ''}
                {trend.diff.toFixed(1)} kg
              </div>
              <div className="text-xs text-slate-500">
                {fmtDate(trend.first.date)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gráfico */}
      {chartData.length >= 2 && (
        <ProgressChart data={chartData} valueKey="weight" label="Peso (kg)" />
      )}

      {/* Lista */}
      {sorted.length > 0 && (
        <div className="bg-slate-900 rounded-2xl p-4">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
            Historial
          </div>
          {[...sorted].reverse().map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0 text-sm"
            >
              <span className="text-slate-400">{fmtDate(b.date)}</span>
              <span className="font-semibold">{b.weight} kg</span>
              <button
                onClick={() => removeEntry(b.id)}
                className="text-red-400 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {sorted.length === 0 && (
        <div className="text-slate-400 text-sm text-center py-8">
          Todavía no registraste tu peso. Empezá arriba.
        </div>
      )}
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
  foodGoals,
  setFoodGoals,
  foodDays,
  setFoodDays,
  bodyWeights,
  setBodyWeights,
}) {
  const [newName, setNewName] = useState('')
  const [newMuscle, setNewMuscle] = useState(MUSCLES[0])
  const [importText, setImportText] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [newGoalLabel, setNewGoalLabel] = useState('')
  const [editingGoalId, setEditingGoalId] = useState(null)
  const [editingGoalLabel, setEditingGoalLabel] = useState('')

  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      catalog,
      sessions,
      sets,
      foodGoals,
      foodDays,
      bodyWeights,
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
      if (data.foodGoals) setFoodGoals(data.foodGoals)
      if (data.foodDays) setFoodDays(data.foodDays)
      if (data.bodyWeights) setBodyWeights(data.bodyWeights)
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

  const addGoal = () => {
    if (!newGoalLabel.trim()) return
    setFoodGoals([
      ...foodGoals,
      { id: uid(), label: newGoalLabel.trim(), active: true },
    ])
    setNewGoalLabel('')
  }

  const toggleGoalActive = (id) => {
    setFoodGoals(
      foodGoals.map((g) => (g.id === id ? { ...g, active: !g.active } : g))
    )
  }

  const removeGoal = (id) => {
    if (!confirm('Se va a eliminar el objetivo. Los checks históricos se mantienen pero ya no cuentan.')) return
    setFoodGoals(foodGoals.filter((g) => g.id !== id))
  }

  const startEditGoal = (goal) => {
    setEditingGoalId(goal.id)
    setEditingGoalLabel(goal.label)
  }

  const saveEditGoal = () => {
    if (!editingGoalLabel.trim()) return
    setFoodGoals(
      foodGoals.map((g) =>
        g.id === editingGoalId ? { ...g, label: editingGoalLabel.trim() } : g
      )
    )
    setEditingGoalId(null)
    setEditingGoalLabel('')
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
          <div>
            <div className="text-2xl font-bold text-emerald-400">
              {foodDays.length}
            </div>
            <div className="text-xs text-slate-400">Días comida</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">
              {bodyWeights.length}
            </div>
            <div className="text-xs text-slate-400">Pesadas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">
              {foodGoals.filter((g) => g.active).length}
            </div>
            <div className="text-xs text-slate-400">Objetivos</div>
          </div>
        </div>
      </section>

      {/* Objetivos nutricionales */}
      <section className="bg-slate-900 rounded-2xl p-4 space-y-3">
        <h2 className="font-bold">Objetivos nutricionales</h2>
        <p className="text-xs text-slate-400">
          Estos son los checks que aparecen cada día en la pestaña Comida.
        </p>

        <div className="space-y-2 border-b border-slate-800 pb-3">
          <input
            type="text"
            placeholder="Nuevo objetivo..."
            value={newGoalLabel}
            onChange={(e) => setNewGoalLabel(e.target.value)}
            className="w-full bg-slate-800 rounded-lg px-3 py-2"
          />
          <button
            onClick={addGoal}
            className="w-full bg-emerald-500 text-slate-950 font-bold py-2 rounded-lg"
          >
            + Agregar objetivo
          </button>
        </div>

        {foodGoals.map((g) => (
          <div key={g.id} className="flex items-center gap-2 py-2 border-b border-slate-800 last:border-0">
            <button
              onClick={() => toggleGoalActive(g.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                g.active
                  ? 'bg-emerald-500 border-emerald-500 text-slate-950 text-xs'
                  : 'border-slate-600'
              }`}
              title={g.active ? 'Activo' : 'Inactivo'}
            >
              {g.active && '✓'}
            </button>
            {editingGoalId === g.id ? (
              <>
                <input
                  type="text"
                  value={editingGoalLabel}
                  onChange={(e) => setEditingGoalLabel(e.target.value)}
                  className="flex-1 bg-slate-800 rounded px-2 py-1 text-sm"
                  autoFocus
                />
                <button
                  onClick={saveEditGoal}
                  className="text-emerald-400 text-xs"
                >
                  OK
                </button>
              </>
            ) : (
              <>
                <span
                  className={`flex-1 text-sm ${
                    g.active ? 'text-slate-100' : 'text-slate-500 line-through'
                  }`}
                >
                  {g.label}
                </span>
                <button
                  onClick={() => startEditGoal(g)}
                  className="text-slate-400 text-xs"
                >
                  ✏️
                </button>
                <button
                  onClick={() => removeGoal(g.id)}
                  className="text-red-400 text-xs"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        ))}
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
        Gym Agustín · v1.1
      </div>
    </div>
  )
}
