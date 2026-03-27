import { useMemo, useState } from "react";
import dogsData from "../dogs-6.json";

interface DogProfile {
  id: string;
  name: string;
  gender: string;
  size: string;
  ageText: string;
  ageCategory: string;
  tags: string[];
  hasDisability: boolean;
  compat: {
    dogs: "yes" | "no" | "maybe";
    cats: "yes" | "no" | "maybe";
    kids: "yes" | "no" | "maybe";
  };
  careLabel: string;
  bio: string;
  photoUrl: string;
  adoptionPage: string;
  source: string;
}

const dogs = dogsData as DogProfile[];

function compatibilityLabel(value: DogProfile["compat"]["dogs"]) {
  if (value === "yes") return "Yes";
  if (value === "no") return "No";
  return "Maybe";
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<DogProfile[]>([]);

  const currentDog = dogs[index];
  const total = dogs.length;
  const finished = index >= total;

  const specialCount = useMemo(() => liked.filter((dog) => dog.hasDisability).length, [liked]);

  const advance = () => setIndex((value) => value + 1);

  const handlePass = () => {
    if (finished) return;
    advance();
  };

  const handleLike = () => {
    if (finished || !currentDog) return;
    setLiked((prev) => [...prev, currentDog]);
    advance();
  };

  const handleRestart = () => {
    setIndex(0);
    setLiked([]);
  };

  if (finished) {
    return (
      <div className="page-shell">
        <div className="page-header">
          <p className="eyebrow">Dog adoption game</p>
          <h1>Your shortlist</h1>
          <p className="lede">
            You saved {liked.length} dog{liked.length === 1 ? "" : "s"}. {specialCount > 0 ? `${specialCount} of them have additional care needs.` : "Every shortlist helps more dogs get seen."}
          </p>
        </div>

        <div className="results-grid">
          {liked.length === 0 ? (
            <section className="panel empty-state">
              <h2>No dogs saved yet</h2>
              <p>Try again and tap “Meet this dog” on any profile you want to keep.</p>
            </section>
          ) : (
            liked.map((dog) => (
              <article className="result-card" key={dog.id}>
                <img className="result-card__image" src={dog.photoUrl} alt={dog.name} />
                <div className="result-card__body">
                  <div className="result-card__title-row">
                    <h2>{dog.name}</h2>
                    <span className="tag tag--soft">{dog.ageCategory}</span>
                  </div>
                  <p className="result-card__meta">{dog.gender} · {dog.size} · {dog.ageText}</p>
                  <p className="result-card__bio">{dog.bio}</p>
                  <a className="button button--primary" href={dog.adoptionPage} target="_blank" rel="noreferrer">
                    Open adoption page
                  </a>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="footer-actions">
          <button className="button button--ghost" type="button" onClick={handleRestart}>
            Start again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <p className="eyebrow">Dog adoption game</p>
        <h1>Tinder-style dog discovery</h1>
        <p className="lede">
          Browse adoptable dogs from the Soi Dog MVP dataset. Tap pass to skip or meet this dog to save a profile for later.
        </p>
      </div>

      <section className="status-bar panel">
        <div>
          <span className="status-label">Progress</span>
          <strong>{index + 1} / {total}</strong>
        </div>
        <div>
          <span className="status-label">Saved</span>
          <strong>{liked.length}</strong>
        </div>
      </section>

      <article className="card panel">
        <div className="card__image-wrap">
          <img className="card__image" src={currentDog.photoUrl} alt={currentDog.name} />
        </div>

        <div className="card__body">
          <div className="card__title-row">
            <div>
              <h2>{currentDog.name}</h2>
              <p className="card__meta">{currentDog.gender} · {currentDog.size} · {currentDog.ageText}</p>
            </div>
            <span className="tag">{currentDog.ageCategory}</span>
          </div>

          <p className="care-label">{currentDog.careLabel}</p>
          <p className="card__bio">{currentDog.bio}</p>

          <div className="tag-list">
            {currentDog.tags.map((tag) => (
              <span className="tag tag--soft" key={tag}>{tag}</span>
            ))}
          </div>

          <dl className="compat-grid">
            <div>
              <dt>Dogs</dt>
              <dd>{compatibilityLabel(currentDog.compat.dogs)}</dd>
            </div>
            <div>
              <dt>Cats</dt>
              <dd>{compatibilityLabel(currentDog.compat.cats)}</dd>
            </div>
            <div>
              <dt>Kids</dt>
              <dd>{compatibilityLabel(currentDog.compat.kids)}</dd>
            </div>
          </dl>

          <div className="button-row">
            <button className="button button--ghost" type="button" onClick={handlePass}>
              Pass
            </button>
            <button className="button button--primary" type="button" onClick={handleLike}>
              Meet this dog
            </button>
          </div>

          <a className="text-link" href={currentDog.adoptionPage} target="_blank" rel="noreferrer">
            View original Soi Dog adoption page
          </a>
        </div>
      </article>
    </div>
  );
}
