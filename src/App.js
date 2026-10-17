
import React, { useState } from "react";

const questions = [
  {
    id: "nameMajor",
    title: "Let's get to know you.",
    helper: "We'll personalize your semester around you.",
    type: "profile",
  },
  {
    id: "sleep",
    title: "What's your sleep schedule like?",
    helper: "We'll plan study sessions around when you're awake.",
    type: "sleep",
  },
  {
    id: "study",
    title: "How many hours do you study each day?",
    helper: "Enter your usual daily study time. Decimals are okay, too.",
    type: "study",
  },
  {
    id: "breaks",
    title: "How do you take breaks?",
    helper: "Regular breaks can help you stay focused for longer.",
    type: "breaks",
  },
  {
    id: "focus",
    title: "When do you focus the best?",
    helper: "We'll try to schedule your hardest tasks during your peak hours.",
    type: "focus",
  },
  {
    id: "deadline",
    title: "When do you start assignments?",
    helper: "How far ahead of the deadline do you usually get started?",
    type: "deadline",
  },
];

const initialAnswers = {
  name: "",
  major: "",
  wake: "08:00",
  sleep: "23:00",
  studyHours: "",
  breakMinutes: "15",
  breakFrequency: "Every 60 minutes",
  focusPeriod: "Afternoon",
  focusTime: "14:00",
  deadlineDays: 3,
};

const focusOptions = ["Morning", "Afternoon", "Evening", "Night"];

function formatTime(time) {
  if (!time) return "Not selected";

  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TimeField({ label, value, onChange }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </label>
  );
}

function DurationSlider({ label, value, onChange, min, max, unit }) {
  return (
    <div className="slider-panel">
      <div className="slider-heading">
        <span className="field-label">{label}</span>
        <strong>
          {value} <span>{unit}</span>
        </strong>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      <div className="range-labels">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState(-1);
  const [answers, setAnswers] = useState(initialAnswers);

  const question = questions[screen];
  const isWelcome = screen === -1;
  const isComplete = screen === questions.length;

  const update = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => setScreen((prev) => prev + 1);
  const back = () => setScreen((prev) => prev - 1);

  const validStudyHours =
    answers.studyHours.trim() !== "" &&
    Number.isFinite(Number(answers.studyHours)) &&
    Number(answers.studyHours) >= 0 &&
    Number(answers.studyHours) <= 24;

  const canContinue = !question
    ? true
    : question.type === "profile"
    ? answers.name.trim() !== "" && answers.major.trim() !== ""
    : question.type === "study"
    ? validStudyHours
    : true;

  const progress = isComplete
    ? 100
    : isWelcome
    ? 0
    : ((screen + 1) / questions.length) * 100;

  const reset = () => {
    setAnswers(initialAnswers);
    setScreen(-1);
  };

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: 'DM Sans', sans-serif;
          color: #263b59;
          background: #f7f8fc;
        }

        button, input, select { font: inherit; }
        button { cursor: pointer; }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(ellipse at 8% 12%, #e9efff 0, transparent 32%),
            radial-gradient(ellipse at 92% 88%, #fff0df 0, transparent 28%),
            #f8f9fc;
        }

        .topbar {
          padding: 25px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          font: 800 23px 'Manrope', sans-serif;
          letter-spacing: -1px;
          color: #19345c;
        }

        .brand-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: white;
          background: #254c83;
        }

        .top-note { color: #8792a6; font-size: 13px; }

        .main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px 22px 55px;
        }

        .card {
          width: 100%;
          max-width: 640px;
          padding: 42px 44px 34px;
          background: rgba(255,255,255,.96);
          border: 1px solid #e9edf4;
          border-radius: 24px;
          box-shadow: 0 20px 70px #243c6310;
          animation: appear .25s ease;
        }

        @keyframes appear {
          from { opacity: 0; transform: translateY(7px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .eyebrow {
          color: #5273a5;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 14px;
        }

        h1, h2 {
          font-family: 'Manrope', sans-serif;
          color: #19345c;
          letter-spacing: -1.2px;
        }

        h1 {
          font-size: clamp(36px, 5vw, 52px);
          line-height: 1.15;
          margin: 0 0 17px;
        }

        h2 {
          font-size: 30px;
          line-height: 1.3;
          margin: 0 0 12px;
        }

        .accent { color: #5276ad; }

        .description, .helper {
          color: #7b879b;
          line-height: 1.7;
          font-size: 14px;
        }

        .description { margin: 0 0 25px; }
        .helper { margin: 0 0 26px; }

        .welcome-art {
          height: 145px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          background: #edf2ff;
          border-radius: 17px;
          margin: 26px 0;
        }

        .mini-day {
          width: 86px;
          height: 100px;
          padding: 11px;
          background: white;
          border-radius: 11px;
          box-shadow: 0 5px 15px #254c8310;
          transform: rotate(-5deg);
        }

        .mini-day:nth-child(2) { transform: translateY(-7px); }
        .mini-day:nth-child(3) { transform: rotate(5deg); }
        .mini-line { height: 6px; background: #e9edf5; border-radius: 5px; margin-bottom: 8px; }
        .mini-block { height: 21px; background: #dce7ff; border-radius: 5px; margin-bottom: 7px; }
        .warm { background: #ffe5c9; }

        .primary {
          background: #254c83;
          color: white;
          border: none;
          border-radius: 11px;
          padding: 15px 22px;
          font-size: 14px;
          font-weight: 700;
          transition: .2s;
        }

        .primary:hover { background: #193b6d; transform: translateY(-1px); }
        .primary:disabled { background: #aab8cc; cursor: not-allowed; transform: none; }
        .full { width: 100%; }

        .welcome-footer {
          text-align: center;
          margin-top: 16px;
          font-size: 12px;
          color: #929bad;
        }

        .progress-section { margin-bottom: 32px; }
        .progress-meta { display: flex; justify-content: space-between; color: #8590a3; font-size: 11px; font-weight: 700; margin-bottom: 10px; }
        .progress-track { height: 5px; background: #edf0f6; border-radius: 8px; overflow: hidden; }
        .progress-fill { height: 100%; background: #315a94; transition: width .3s; border-radius: 8px; }

        .field { display: block; margin-bottom: 20px; }
        .field-label { display: block; font-size: 13px; font-weight: 700; color: #52627b; margin-bottom: 10px; }

        .field input:not([type="range"]), .field select {
          width: 100%;
          min-height: 49px;
          padding: 12px 14px;
          border: 1px solid #dfe5ef;
          background: #fbfcff;
          border-radius: 11px;
          color: #304766;
          outline: none;
        }

        .field input:focus, .field select:focus {
          border-color: #5279b4;
        }

        .study-input {
          width: 100%;
          padding: 17px;
          border: 1px solid #dfe5ef;
          border-radius: 12px;
          background: #fbfcff;
          color: #254c83;
          font-size: 18px;
          outline: none;
        }

        .study-input:focus {
          border-color: #5279b4;
          box-shadow: 0 0 0 3px #315a9415;
        }

        .input-hint {
          color: #8a94a7;
          font-size: 12px;
          margin-top: 9px;
        }

        .two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .slider-panel {
          background: #fbfcff;
          border: 1px solid #e4e9f2;
          border-radius: 14px;
          padding: 19px;
          margin-bottom: 15px;
        }

        .slider-heading { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .slider-heading strong { color: #254c83; font-size: 19px; white-space: nowrap; }
        .slider-heading strong span { font-size: 12px; font-weight: 500; color: #7c879b; }

        input[type="range"] { width: 100%; accent-color: #315a94; cursor: pointer; }
        .range-labels { display: flex; justify-content: space-between; color: #8a94a7; font-size: 11px; }

        .option-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
        .option {
          min-height: 68px;
          padding: 15px;
          border: 1px solid #e2e7f0;
          border-radius: 12px;
          background: white;
          color: #354966;
          font-size: 14px;
          font-weight: 600;
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .option:hover { border-color: #8ca7d1; }
        .option.selected { background: #eef3ff; border: 1.5px solid #315a94; color: #214779; }
        .check { width: 20px; height: 20px; flex-shrink: 0; display: grid; place-items: center; border: 1px solid #d9e0ec; border-radius: 50%; font-size: 11px; }
        .selected .check { background: #315a94; color: white; border-color: #315a94; }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 30px;
          padding-top: 23px;
          border-top: 1px solid #eef0f5;
        }

        .back {
          border: none;
          background: transparent;
          color: #65748c;
          font-size: 14px;
          font-weight: 600;
          padding: 13px 5px;
        }

        .back:hover { color: #19345c; }

        .success { text-align: center; }
        .success-icon {
          width: 74px;
          height: 74px;
          display: grid;
          place-items: center;
          margin: 0 auto 24px;
          border-radius: 24px;
          background: #e8f3e9;
          color: #37774b;
          font-size: 34px;
        }

        .summary {
          margin: 26px 0;
          padding: 19px;
          border: 1px solid #edf0f5;
          border-radius: 14px;
          background: #f7f9fd;
          text-align: left;
        }

        .summary-title { font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #8190a6; margin-bottom: 10px; }
        .summary-row { display: flex; justify-content: space-between; gap: 15px; padding: 10px 0; border-bottom: 1px solid #e9edf4; font-size: 12px; }
        .summary-row:last-child { border-bottom: none; }
        .summary-row span:first-child { color: #77849a; }
        .summary-row span:last-child { color: #304766; font-weight: 700; text-align: right; overflow-wrap: anywhere; }

        @media (max-width: 600px) {
          .topbar { padding: 20px; }
          .top-note { font-size: 11px; }
          .main { padding: 10px 14px 32px; align-items: flex-start; }
          .card { padding: 29px 21px 24px; border-radius: 20px; }
          h2 { font-size: 26px; }
          .two-columns { grid-template-columns: 1fr; gap: 0; }
          .option-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">A</div>
          AntBlock
        </div>
        <div className="top-note">
          {isWelcome
            ? "Your semester starts here"
            : isComplete
            ? "Setup complete"
            : "Let's build your routine"}
        </div>
      </header>

      <main className="main">
        {isWelcome && (
          <section className="card">
            <div className="eyebrow">A little more organized</div>
            <h1>
              Your whole semester,
              <br />
              <span className="accent">blocked out.</span>
            </h1>
            <p className="description">
              Your classes, study sessions, and breaks — all in one plan
              built around your life.
            </p>

            <div className="welcome-art" aria-hidden="true">
              {[0, 1, 2].map((day) => (
                <div className="mini-day" key={day}>
                  <div className="mini-line" style={{ width: "55%" }} />
                  <div className="mini-block" />
                  <div className={`mini-block ${day === 1 ? "warm" : ""}`} />
                  <div className="mini-line" style={{ width: "75%" }} />
                </div>
              ))}
            </div>

            <button className="primary full" onClick={next}>
              Get started →
            </button>
            <div className="welcome-footer">
              6 quick questions · Make this semester yours
            </div>
          </section>
        )}

        {!isWelcome && !isComplete && (
          <section className="card" key={question.id}>
            <div className="progress-section">
              <div className="progress-meta">
                <span>QUESTION {screen + 1} OF {questions.length}</span>
                <span>{Math.round(progress)}% COMPLETE</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="eyebrow">Let's make it yours</div>
            <h2>{question.title}</h2>
            <p className="helper">{question.helper}</p>

            {question.type === "profile" && (
              <>
                <label className="field">
                  <span className="field-label">Your name</span>
                  <input
                    type="text"
                    placeholder="e.g. Alex Johnson"
                    value={answers.name}
                    onChange={(e) => update("name", e.target.value)}
                    autoComplete="name"
                  />
                </label>
                <label className="field">
                  <span className="field-label">Your major</span>
                  <input
                    type="text"
                    placeholder="e.g. Economics"
                    value={answers.major}
                    onChange={(e) => update("major", e.target.value)}
                  />
                </label>
              </>
            )}

            {question.type === "sleep" && (
              <div className="two-columns">
                <TimeField
                  label="I usually wake up"
                  value={answers.wake}
                  onChange={(v) => update("wake", v)}
                />
                <TimeField
                  label="I usually go to sleep"
                  value={answers.sleep}
                  onChange={(v) => update("sleep", v)}
                />
              </div>
            )}

            {question.type === "study" && (
              <div>
                <label className="field">
                  <span className="field-label">
                    Study hours per day
                  </span>
                  <input
                    className="study-input"
                    type="number"
                    min="0"
                    max="24"
                    step="any"
                    placeholder="e.g. 4 or 3.5"
                    value={answers.studyHours}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        update("studyHours", value);
                      }
                    }}
                  />
                  <div className="input-hint">
                    Enter a number between 0 and 24. You can use decimals,
                    such as 2.5 hours.
                  </div>
                </label>
              </div>
            )}

            {question.type === "breaks" && (
              <>
                <SelectField
                  label="How long is each break?"
                  value={answers.breakMinutes}
                  onChange={(v) => update("breakMinutes", v)}
                  options={[
                    { value: "5", label: "5 minutes" },
                    { value: "10", label: "10 minutes" },
                    { value: "15", label: "15 minutes" },
                    { value: "20", label: "20 minutes" },
                    { value: "30", label: "30 minutes" },
                    { value: "45", label: "45 minutes" },
                    { value: "60", label: "1 hour" },
                  ]}
                />
                <SelectField
                  label="How often do you take breaks?"
                  value={answers.breakFrequency}
                  onChange={(v) => update("breakFrequency", v)}
                  options={[
                    { value: "Every 25 minutes", label: "Every 25 minutes" },
                    { value: "Every 30 minutes", label: "Every 30 minutes" },
                    { value: "Every 45 minutes", label: "Every 45 minutes" },
                    { value: "Every 60 minutes", label: "Every 60 minutes" },
                    { value: "Every 90 minutes", label: "Every 90 minutes" },
                    { value: "Whenever I need one", label: "Whenever I need one" },
                  ]}
                />
              </>
            )}

            {question.type === "focus" && (
              <>
                <div className="option-grid">
                  {focusOptions.map((option) => {
                    const selected = answers.focusPeriod === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`option ${selected ? "selected" : ""}`}
                        aria-pressed={selected}
                        onClick={() => update("focusPeriod", option)}
                      >
                        {option}
                        <span className="check">
                          {selected ? "✓" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: 23 }}>
                  <TimeField
                    label="What time do you feel most focused?"
                    value={answers.focusTime}
                    onChange={(v) => update("focusTime", v)}
                  />
                </div>
              </>
            )}

            {question.type === "deadline" && (
              <DurationSlider
                label="Days before the deadline"
                value={answers.deadlineDays}
                onChange={(v) => update("deadlineDays", v)}
                min={0}
                max={30}
                unit="days"
              />
            )}

            <div className="nav">
              <button className="back" onClick={back}>
                ← Back
              </button>
              <button
                className="primary"
                onClick={next}
                disabled={!canContinue}
              >
                {screen === questions.length - 1
                  ? "Finish setup"
                  : "Next →"}
              </button>
            </div>
          </section>
        )}

        {isComplete && (
          <section className="card success">
            <div className="success-icon">✓</div>
            <div className="eyebrow">Ready when you are</div>
            <h2>
              You're all set{answers.name ? `, ${answers.name}` : ""}!
            </h2>
            <p className="description">
              Your preferences are ready. Let's turn them into a semester
              that feels more manageable.
            </p>

            <div className="summary">
              <div className="summary-title">YOUR STUDY PROFILE</div>

              <div className="summary-row">
                <span>Major</span>
                <span>{answers.major}</span>
              </div>

              <div className="summary-row">
                <span>Sleep schedule</span>
                <span>
                  {formatTime(answers.wake)} – {formatTime(answers.sleep)}
                </span>
              </div>

              <div className="summary-row">
                <span>Daily study goal</span>
                <span>{answers.studyHours} hours per day</span>
              </div>

              <div className="summary-row">
                <span>Break length</span>
                <span>{answers.breakMinutes} minutes</span>
              </div>

              <div className="summary-row">
                <span>Break frequency</span>
                <span>{answers.breakFrequency}</span>
              </div>

              <div className="summary-row">
                <span>Peak focus</span>
                <span>
                  {answers.focusPeriod}, {formatTime(answers.focusTime)}
                </span>
              </div>

              <div className="summary-row">
                <span>Assignment lead time</span>
                <span>{answers.deadlineDays} days early</span>
              </div>
            </div>

            <button
              className="primary full"
              onClick={() =>
                alert(
                  "Your preferences are collected! Connect your schedule-generation logic here to build the semester plan."
                )
              }
            >
              Build my schedule →
            </button>

            <button
              className="back"
              onClick={reset}
              style={{ marginTop: 12 }}
            >
              Start over
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
