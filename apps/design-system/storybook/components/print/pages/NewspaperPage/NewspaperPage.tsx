import React from "react";
import PrintPage from "../../../../atoms/print/PrintPage/PrintPage";
import NewsStory from "../../../../atoms/print/NewsStory/NewsStory";
import styles from "./NewspaperPage.module.css";
import type {
  NewspaperPageProps,
  NewspaperInput,
  Masthead,
  Article,
  ShortNote,
  WeatherBox,
  ClassifiedAd,
  Horoscope,
  BestsellerList,
  PullQuote,
} from "./types";
import type { LayoutSlot, PageLayout } from "./layouts";
import { FRONT_LAYOUT, BACK_LAYOUT } from "./layouts";
import { defaultNewspaperContent, assembleNewspaper } from "./defaults";

/* ─────────────────────────────────────────────
 * MASTHEAD
 * ───────────────────────────────────────────── */
const DEFAULT_MASTHEAD: Masthead = {
  paperName: "THE NAPA VALLEY REGISTER",
  tagline: "Serving Wine Country Since 1952",
  date: "Sunday, October 13, 2024",
  price: "$2.50",
  edition: "Morning Edition",
};

function MastheadBlock({ data }: { data: Masthead }) {
  return (
    <header className={styles.masthead}>
      <div className={styles.mastheadTopRule}>
        <span className={styles.mastheadRuleLine} />
        <span className={styles.mastheadRuleLine} />
      </div>
      <div className={styles.mastheadCenter}>
        <div className={styles.mastheadMeta}>
          <span>{data.edition ?? "Morning Edition"}</span>
          <span>{data.date}</span>
          <span>{data.price}</span>
        </div>
        <h1 className={styles.paperName}>{data.paperName}</h1>
        <p className={styles.tagline}>— {data.tagline} —</p>
      </div>
      <div className={styles.mastheadBottomRule}>
        <span className={styles.mastheadRuleLine} />
        <span className={styles.mastheadRuleThick} />
        <span className={styles.mastheadRuleLine} />
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
 * BREAKING BANNER
 * ───────────────────────────────────────────── */
function BreakingBannerBlock({ data }: { data: NonNullable<NewspaperInput["breakingBanner"]> }) {
  return (
    <div className={styles.breakingBanner}>
      {data.label && <span className={styles.breakingLabel}>{data.label}</span>}
      <span className={styles.breakingHeadline}>{data.headline}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * ARTICLE BLOCK — delegates to NewsStory atom
 * Columns come from the layout slot, not the article.
 * ───────────────────────────────────────────── */
function ArticleBlock({
  article,
  columns = 1,
  layoutHint,
}: {
  article: Article;
  columns?: number;
  layoutHint?: "hero" | "sidebar" | "bottom" | "image-left";
}) {
  return (
    <NewsStory
      variant="standard"
      columns={Math.min(columns, 3) as 1 | 2 | 3}
      label={article.label}
      headline={article.headline}
      subheadline={article.subheadline}
      byline={article.byline}
      body={article.body}
      hasPhoto={article.hasPhoto}
      photoUrl={article.photoUrl}
      photoCaption={article.photoCaption}
      photoAspect={article.photoAspect}
      layoutHint={layoutHint}
    />
  );
}

/* ─────────────────────────────────────────────
 * SHORT NOTE — delegates to NewsStory featured variant
 * ───────────────────────────────────────────── */
function ShortNoteBlock({ article, variant = "dark" }: { article: Article; variant?: "dark" | "light" }) {
  return (
    <NewsStory
      variant="featured"
      theme={variant}
      label={article.label}
      headline={article.headline}
      body={article.body}
    />
  );
}

/* ─────────────────────────────────────────────
 * PHOTO BLOCK
 * ───────────────────────────────────────────── */
function PhotoBlockEl({ slot }: { slot: LayoutSlot }) {
  return (
    <div className={styles.photoBlock}>
      <div
        className={styles.photoPlaceholder}
        style={{
          aspectRatio:
            slot.photoAspect === "portrait"
              ? "3/4"
              : slot.photoAspect === "square"
                ? "1/1"
                : slot.photoAspect === "wide"
                  ? "3/1"
                  : "16/9",
        }}
      />
      {slot.photoCaption && <p className={styles.photoCaption}>{slot.photoCaption}</p>}
      {slot.photoByline && <p className={styles.photoCreditLine}>{slot.photoByline}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────
 * PULL QUOTE
 * ───────────────────────────────────────────── */
function PullQuoteBlock({ data }: { data: PullQuote }) {
  return (
    <aside className={styles.pullQuote}>
      <div className={styles.pullQuoteRule} />
      <blockquote className={styles.pullQuoteText}>"{data.quote}"</blockquote>
      <p className={styles.pullQuoteAttribution}>— {data.attribution}</p>
      <div className={styles.pullQuoteRule} />
    </aside>
  );
}

/* ─────────────────────────────────────────────
 * WEATHER BOX
 * ───────────────────────────────────────────── */
function WeatherBoxBlock({ data }: { data: WeatherBox }) {
  return (
    <div className={styles.weatherBox}>
      <div className={styles.weatherHeader}>WEATHER — {data.region.toUpperCase()}</div>
      <div className={styles.weatherBody}>
        <div className={styles.weatherMain}>
          <span className={styles.weatherIcon}>☀</span>
          <span className={styles.weatherDesc}>{data.description}</span>
        </div>
        <div className={styles.weatherTemps}>
          <span>
            High: <strong>{data.high}</strong>
          </span>
          <span>
            Low: <strong>{data.low}</strong>
          </span>
        </div>
      </div>
      {data.forecast && data.forecast.length > 0 && (
        <div className={styles.weatherForecast}>
          {data.forecast.map((f) => (
            <div key={f.day} className={styles.weatherForecastDay}>
              <span className={styles.weatherForecastLabel}>{f.day}</span>
              <span className={styles.weatherForecastIcon}>{f.icon}</span>
              <span className={styles.weatherForecastTemps}>
                {f.high} / {f.low}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
 * CLASSIFIEDS
 * ───────────────────────────────────────────── */
function ClassifiedsBlock({ ads }: { ads: ClassifiedAd[] }) {
  return (
    <div className={styles.classifieds}>
      <div className={styles.classifiedsHeader}>CLASSIFIEDS</div>
      <div className={styles.classifiedsGrid}>
        {ads.map((ad) => (
          <div key={ad.id} className={styles.classifiedAd}>
            {ad.category && <span className={styles.classifiedCat}>{ad.category} — </span>}
            {ad.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * HOROSCOPES
 * ───────────────────────────────────────────── */
function HoroscopesBlock({ signs }: { signs: Horoscope[] }) {
  return (
    <div className={styles.horoscopes}>
      <div className={styles.sectionHeader}>HOROSCOPES</div>
      <div className={styles.horoscopeGrid}>
        {signs.map((h) => (
          <div key={h.sign} className={styles.horoscopeItem}>
            <div className={styles.horoscopeSignRow}>
              <span className={styles.horoscopeSign}>{h.sign.toUpperCase()}</span>
              <span className={styles.horoscopeDates}>{h.dates}</span>
            </div>
            <p className={styles.horoscopeText}>{h.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * BESTSELLER LIST
 * ───────────────────────────────────────────── */
function BestsellerBlock({ data }: { data: BestsellerList }) {
  return (
    <div className={styles.bestseller}>
      <div className={styles.sectionHeader}>BESTSELLERS — {data.category.toUpperCase()}</div>
      <ol className={styles.bestsellerList}>
        {data.books.map((b) => (
          <li key={b.rank} className={styles.bestsellerItem}>
            <span className={styles.bestsellerRank}>{b.rank}.</span>{" "}
            <span className={styles.bestsellerTitle}>{b.title}</span>{" "}
            <span className={styles.bestsellerAuthor}>— {b.author}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * SLOT RENDERER — maps layout slot → component
 * ───────────────────────────────────────────── */
function renderSlotContent(slot: LayoutSlot, content: NewspaperInput) {
  switch (slot.render) {
    case "article": {
      const article = content.articles.find((a) => a.id === slot.articleId);
      if (!article) return null;
      return <ArticleBlock article={article} columns={slot.columns} layoutHint={slot.layoutHint} />;
    }
    case "shortNote": {
      const note = slot.componentKey ? content[slot.componentKey] : undefined;
      if (!note) return null;
      return (
        <ShortNoteBlock
          article={{ id: note.id, type: "secondary", headline: note.headline, body: note.body, label: note.label }}
          variant={slot.variant}
        />
      );
    }
    case "photo":
      return <PhotoBlockEl slot={slot} />;
    case "weather":
      return content.sidebar?.weather ? <WeatherBoxBlock data={content.sidebar.weather} /> : null;
    case "classifieds":
      return content.classifieds ? <ClassifiedsBlock ads={content.classifieds} /> : null;
    case "horoscopes":
      return content.sidebar?.horoscopes ? <HoroscopesBlock signs={content.sidebar.horoscopes} /> : null;
    case "bestsellers":
      return content.sidebar?.bestsellers ? <BestsellerBlock data={content.sidebar.bestsellers} /> : null;
    case "pullQuote":
      return content.sidebar?.pullQuote ? <PullQuoteBlock data={content.sidebar.pullQuote} /> : null;
    default:
      return null;
  }
}

function renderSlot(slot: LayoutSlot, idx: number, content: NewspaperInput) {
  const startsAtCol1 = slot.gridColumn === "1" || slot.gridColumn.startsWith("1 ");
  const isRow1 = slot.gridRow === "1";
  return (
    <div
      key={slot.name}
      style={{
        gridRow: slot.gridRow,
        gridColumn: slot.gridColumn,
        height: "100%",
        ...(!startsAtCol1 ? { borderLeft: "1pt solid #aaa" } : {}),
        ...(!isRow1 ? { borderTop: "0.5pt solid #ccc" } : {}),
      }}
    >
      {renderSlotContent(slot, content)}
    </div>
  );
}

/* ─────────────────────────────────────────────
 * SINGLE PAGE RENDERER
 * ───────────────────────────────────────────── */
function NewspaperPageSingle({ layout, content }: { layout: PageLayout; content: NewspaperInput }) {
  const masthead: Masthead = { ...DEFAULT_MASTHEAD, ...content.masthead };
  return (
    <PrintPage size="tabloid">
      <div className={styles.page}>
        {layout.showMasthead && <MastheadBlock data={masthead} />}
        {layout.showBreakingBanner && content.breakingBanner && <BreakingBannerBlock data={content.breakingBanner} />}
        <div className={styles.columnRule} />
        <div className={styles.contentGrid} style={{ gridTemplateRows: layout.gridRows }}>
          {layout.slots.map((slot, i) => renderSlot(slot, i, content))}
        </div>
      </div>
    </PrintPage>
  );
}

/* ─────────────────────────────────────────────
 * MAIN COMPONENT — one call = front + back page
 * ───────────────────────────────────────────── */
export default function NewspaperPage({ articles, components }: NewspaperPageProps) {
  const content: NewspaperInput =
    articles && components ? assembleNewspaper(articles, components) : defaultNewspaperContent;

  React.useEffect(() => {
    const fontId = "gravity-newspaper-fonts";
    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Special+Elite&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className={styles.document}>
      <NewspaperPageSingle layout={FRONT_LAYOUT} content={content} />
      <NewspaperPageSingle layout={BACK_LAYOUT} content={content} />
    </div>
  );
}
