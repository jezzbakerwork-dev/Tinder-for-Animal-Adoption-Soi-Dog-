import { useCallback, useEffect, useMemo, useState } from "react";
import { ProgressHeader } from "./components/ProgressHeader";
import { QuizCard } from "./components/QuizCard";
import { ResultCard } from "./components/ResultCard";
import { quizQuestions, quizResultBands, textFor, uiText } from "./data/quizData";
import { useSwipeGesture } from "./hooks/useSwipeGesture";
import { getProgressLabel, getQuizResult, getQuizScore } from "./lib/quizResults";
import type { Language } from "./types/quiz";

function LanguagePicker({ onSelect }: { onSelect: (language: Language) => void }) {
  return (
    <main className="language-screen">
      <section className="panel language-card">
        <p className="eyebrow">{textFor(uiText.languagePicker.eyebrow, "en")}</p>
        <h1>{textFor(uiText.languagePicker.title, "en")}</h1>
        <p className="language-card__body">{textFor(uiText.languagePicker.body, "en")}</p>

        <div className="language-grid">
          <button className="language-option" type="button" onClick={() => onSelect("th")}>
            <span className="language-option__label">{textFor(uiText.languagePicker.thaiLabel, "th")}</span>
            <span className="language-option__flag-preview language-option__flag-preview--thai" aria-hidden="true" />
          </button>

          <button className="language-option" type="button" onClick={() => onSelect("en")}>
            <span className="language-option__label">{textFor(uiText.languagePicker.englishLabel, "en")}</span>
            <span className="language-option__flag-preview language-option__flag-preview--uk" aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const currentIndex = answers.length;
  const isComplete = currentIndex >= quizQuestions.length;
  const currentQuestion = isComplete ? null : quizQuestions[currentIndex];
  const score = useMemo(() => getQuizScore(answers), [answers]);
  const result = isComplete ? getQuizResult(score) : null;
  const progressLabel = getProgressLabel(currentIndex, quizQuestions.length, language ?? "en");

  const handleAnswer = useCallback((value: boolean) => {
    setAnswers((prev) => [...prev, value]);
  }, []);

  const handleUndo = useCallback(() => {
    setAnswers((prev) => prev.slice(0, -1));
  }, []);

  const handleRestart = useCallback(() => {
    setAnswers([]);
  }, []);

  const handleChangeLanguage = useCallback(() => {
    setLanguage(null);
    setAnswers([]);
  }, []);

  const { drag, handlers } = useSwipeGesture({
    onLike: () => handleAnswer(true),
    onPass: () => handleAnswer(false)
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!language) {
        return;
      }

      if (isComplete) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleRestart();
        }
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleAnswer(true);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleAnswer(false);
      } else if (event.key === "Backspace" || event.key.toLowerCase() === "z") {
        event.preventDefault();
        handleUndo();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleAnswer, handleRestart, handleUndo, isComplete, language]);

  if (!language) {
    return <LanguagePicker onSelect={setLanguage} />;
  }

  return (
    <div className="app-shell">
      <header className="hero panel">
        <div className="hero__copy">
          <p className="eyebrow">{textFor(uiText.hero.eyebrow, language)}</p>
          <h1>{textFor(uiText.hero.title, language)}</h1>
          <p className="hero__lede">{textFor(uiText.hero.lede, language)}</p>
        </div>
        <div className="hero__meta">
          <span>{textFor(uiText.hero.metaTrue, language)}</span>
          <span>{textFor(uiText.hero.metaFalse, language)}</span>
          <span>{textFor(uiText.hero.metaSource, language)}</span>
          <button className="meta-button" type="button" onClick={handleChangeLanguage}>
            {textFor(uiText.hero.changeLanguage, language)}
          </button>
        </div>
      </header>

      <main className="game-layout">
        <aside className="panel info-panel">
          <p className="eyebrow">{textFor(uiText.scoring.eyebrow, language)}</p>
          <h2>{textFor(uiText.scoring.title, language)}</h2>
          <ul className="info-list">
            {uiText.scoring.bullets[language].map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>

          <div className="result-guide">
            {quizResultBands.map((band) => (
              <div key={band.animal} className="result-guide__row">
                <strong>
                  {band.min}-{band.max}
                </strong>
                <span>{textFor(band.animalLabel, language)}</span>
              </div>
            ))}
          </div>
        </aside>

        <section className="game-main">
          <ProgressHeader
            current={currentIndex}
            total={quizQuestions.length}
            score={score}
            label={progressLabel}
            language={language}
          />

          {result && isComplete ? (
            <ResultCard result={result} score={score} language={language} onRestart={handleRestart} />
          ) : currentQuestion ? (
            <QuizCard
              question={currentQuestion}
              dragX={drag.x}
              dragY={drag.y}
              language={language}
              onTrue={() => handleAnswer(true)}
              onFalse={() => handleAnswer(false)}
              onUndo={handleUndo}
              canUndo={answers.length > 0}
              handlers={handlers}
            />
          ) : null}
        </section>

        <aside className="panel info-panel">
          <p className="eyebrow">{textFor(uiText.resultTone.eyebrow, language)}</p>
          <h2>{textFor(uiText.resultTone.title, language)}</h2>
          <p className="info-copy">{textFor(uiText.resultTone.paragraphOne, language)}</p>
          <p className="info-copy">{textFor(uiText.resultTone.paragraphTwo, language)}</p>
        </aside>
      </main>
    </div>
  );
}
