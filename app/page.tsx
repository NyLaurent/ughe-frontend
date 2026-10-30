"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HeaderAction = {
  label: string;
  url: string;
  kind: "link" | "search" | "admin_login";
};

type NavigationItem = {
  label: string;
  url: string;
  show_dropdown: boolean;
};

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
  button_label: string;
  button_url: string;
  media_type: "image" | "video";
  media_url: string;
  alt_text: string;
};

type Stat = {
  value: string;
  description: string;
};

type HomeContent = {
  site: {
    name: string;
    logo_url: string;
    facts_eyebrow: string;
    facts_title: string;
    admin_url: string;
  };
  header_actions: HeaderAction[];
  navigation: NavigationItem[];
  slides: Slide[];
  stats: Stat[];
};

const apiUrl = `${(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "")}/api/home/`;

function ChevronDown() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="m2 4 4 4 4-4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m15.5 15.5 4.2 4.2" />
    </svg>
  );
}

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [error, setError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(apiUrl, { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Homepage content request failed (${response.status}).`);
        }
        return response.json() as Promise<HomeContent>;
      })
      .then(setContent)
      .catch((requestError: unknown) => {
        if (requestError instanceof Error && requestError.name === "AbortError") {
          return;
        }
        setError(
          "Homepage content is temporarily unavailable. Start the Docker services and try again.",
        );
      });

    return () => controller.abort();
  }, []);

  const slide = content?.slides[activeSlide];

  function showSlide(direction: number) {
    const slideCount = content?.slides.length ?? 0;
    if (slideCount > 0) {
      setActiveSlide((current) => (current + direction + slideCount) % slideCount);
    }
  }

  return (
    <main>
      <header className="site-header">
        <div className="header-top">
          <a
            className="brand"
            href="#home"
            aria-label={content?.site.name || "UGHE homepage"}
          >
            {content?.site.logo_url ? (
              <Image
                src={content.site.logo_url}
                alt={content.site.name}
                width={680}
                height={170}
                unoptimized
                priority
              />
            ) : (
              <span className="brand-placeholder">{content?.site.name || "UGHE"}</span>
            )}
          </a>

          <div className="header-actions">
            {content?.header_actions.map((action) =>
              action.kind === "search" ? (
                <a
                  className="search-button"
                  href={action.url}
                  key={`${action.label}-${action.url}`}
                  aria-label={action.label}
                >
                  <SearchIcon />
                  <span className="sr-only">{action.label}</span>
                </a>
              ) : (
                <a
                  className="header-action"
                  href={action.url}
                  key={`${action.label}-${action.url}`}
                >
                  {action.label}
                </a>
              ),
            )}
          </div>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>

        <nav
          id="primary-navigation"
          className={`primary-navigation${menuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          {content?.navigation.map((item) => (
            <a
              key={`${item.label}-${item.url}`}
              href={item.url}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              {item.show_dropdown && <ChevronDown />}
            </a>
          ))}
        </nav>
      </header>

      <section id="home" className="hero" aria-label="Featured stories">
        {slide?.media_url && slide.media_type === "video" ? (
          <video
            key={slide.media_url}
            className="hero-image"
            src={slide.media_url}
            autoPlay
            muted
            loop
            playsInline
            aria-label={slide.alt_text || slide.title}
          />
        ) : slide?.media_url ? (
          <Image
            key={slide.media_url}
            className="hero-image"
            src={slide.media_url}
            alt={slide.alt_text || slide.title}
            fill
            unoptimized
            priority
            sizes="100vw"
          />
        ) : null}
        <div className="hero-shade" />
        {slide ? (
          <div className="hero-copy" aria-live="polite">
            {slide.eyebrow && <p className="hero-eyebrow">{slide.eyebrow}</p>}
            <h1>{slide.title}</h1>
            {slide.description && <p className="hero-description">{slide.description}</p>}
            {slide.button_label && (
              <a className="hero-link" href={slide.button_url || "#"}>
                {slide.button_label}
                <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        ) : (
          <p className="hero-empty" aria-live="polite">
            {error || "Add a featured slide in Django Admin to publish it here."}
          </p>
        )}

        {(content?.slides.length ?? 0) > 1 && (
          <>
            <button
              className="carousel-arrow carousel-previous"
              type="button"
              aria-label="Previous slide"
              onClick={() => showSlide(-1)}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              className="carousel-arrow carousel-next"
              type="button"
              aria-label="Next slide"
              onClick={() => showSlide(1)}
            >
              <span aria-hidden="true">›</span>
            </button>
            <div className="carousel-dots" aria-label="Choose a featured story">
              {content?.slides.map((item, index) => (
                <button
                  key={`${item.title}-${index}`}
                  type="button"
                  className={index === activeSlide ? "is-active" : ""}
                  aria-label={`Show slide ${index + 1}: ${item.eyebrow || item.title}`}
                  aria-current={index === activeSlide ? "true" : undefined}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="facts-section" id="facts" aria-labelledby="facts-heading">
        <p className="section-eyebrow">
          {content?.site.facts_eyebrow || (error ? error : "")}
        </p>
        <h2 id="facts-heading">
          {content?.site.facts_title || (error ? "" : "Loading...")}
        </h2>
        {content?.stats.length ? (
          <div className="stats-grid">
            {content.stats.map((stat, index) => (
              <article className="stat-card" key={`${stat.value}-${index}`}>
                <p className="stat-value">{stat.value}</p>
                <p className="stat-description">{stat.description}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="stats-empty">
            {error || "Add facts and statistics in Django Admin to publish them here."}
          </p>
        )}
      </section>
    </main>
  );
}
