import styles from "./MiroIssueTriage.module.css";

interface PainPoint {
  insight: string;
  evidence: string;
}

interface ProductIdea {
  title: string;
  description: string;
  addressesPainPoint: string;
}

interface TopTweet {
  text: string;
  reason: string;
}

interface MiroIssueTriageProps {
  painPoints: PainPoint[];
  productIdeas: ProductIdea[];
  topTweet: TopTweet;
}

function tryParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function coerceArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string" && value.trim()) {
    let parsed: unknown = tryParse(value);
    // Handle double-encoded strings (string of JSON containing JSON)
    if (typeof parsed === "string") parsed = tryParse(parsed);
    if (Array.isArray(parsed)) return parsed as T[];
  }
  return [];
}

function coerceObject<T>(value: unknown): T | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as T;
  if (typeof value === "string" && value.trim()) {
    let parsed: unknown = tryParse(value);
    if (typeof parsed === "string") parsed = tryParse(parsed);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as T;
  }
  return undefined;
}

export default function MiroIssueTriage({ painPoints, productIdeas, topTweet }: MiroIssueTriageProps) {
  const safePainPoints = coerceArray<PainPoint>(painPoints);
  const safeProductIdeas = coerceArray<ProductIdea>(productIdeas);
  const safeTopTweet = coerceObject<TopTweet>(topTweet);
  const isLoading = safePainPoints.length === 0 && safeProductIdeas.length === 0 && !safeTopTweet;

  if (isLoading) {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="#FFD02F" />
                <path d="M17 7h-4l2.5 4-2.5 4h4l2.5-4L17 7z" fill="#050038" />
                <path d="M7 7h4L8.5 11 11 15H7L4.5 11 7 7z" fill="#050038" />
              </svg>
            </div>
            <div>
              <h2 className={styles.title}>Miro Product Insights</h2>
              <p className={styles.subtitle}>AI-generated from live X signal</p>
            </div>
          </div>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.loadingPulse} />
          <div className={styles.loadingPulse} style={{ width: "70%", animationDelay: "0.15s" }} />
          <div className={styles.loadingPulse} style={{ width: "85%", animationDelay: "0.3s" }} />
          <p className={styles.loadingText}>Waiting for insights…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="#FFD02F" />
              <path d="M17 7h-4l2.5 4-2.5 4h4l2.5-4L17 7z" fill="#050038" />
              <path d="M7 7h4L8.5 11 11 15H7L4.5 11 7 7z" fill="#050038" />
            </svg>
          </div>
          <div>
            <h2 className={styles.title}>Miro Product Insights</h2>
            <p className={styles.subtitle}>AI-generated from live X signal</p>
          </div>
        </div>
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{safePainPoints.length}</span>
            <span className={styles.metricLabel}>Pain Points</span>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metric}>
            <span className={styles.metricValue}>{safeProductIdeas.length}</span>
            <span className={styles.metricLabel}>Ideas</span>
          </div>
        </div>
      </div>

      {safeTopTweet && (
        <div className={styles.topTweet}>
          <div className={styles.topTweetLabel}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Top Signal Tweet
          </div>
          <p className={styles.topTweetText}>"{safeTopTweet.text}"</p>
          <p className={styles.topTweetReason}>{safeTopTweet.reason}</p>
        </div>
      )}

      <div className={styles.sections}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>⚠</span>
            Pain Points
          </h3>
          <div className={styles.cardList}>
            {safePainPoints.map((p, i) => (
              <div key={i} className={styles.painCard}>
                <div className={styles.painRank}>{i + 1}</div>
                <div className={styles.painBody}>
                  <p className={styles.painInsight}>{p.insight}</p>
                  <p className={styles.painEvidence}>{p.evidence}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>💡</span>
            Product Ideas
          </h3>
          <div className={styles.cardList}>
            {safeProductIdeas.map((idea, i) => (
              <div key={i} className={styles.ideaCard}>
                <div className={styles.ideaHeader}>
                  <span className={styles.ideaNumber}>{i + 1}</span>
                  <span className={styles.ideaTitle}>{idea.title}</span>
                </div>
                <p className={styles.ideaDescription}>{idea.description}</p>
                <div className={styles.ideaTag}>↳ {idea.addressesPainPoint}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
