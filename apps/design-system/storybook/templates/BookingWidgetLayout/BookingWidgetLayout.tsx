import React from "react";
import { renderComponent, filterComponents } from "../core";
import type { BookingWidgetLayoutProps } from "./types";
import styles from "./BookingWidgetLayout.module.css";

/**
 * BookingWidgetLayout Template - Booking Widget Display
 *
 * Displays the BookingWidget component.
 * Components are streamed from the server and rendered in order.
 */
export default function BookingWidgetLayout(props: BookingWidgetLayoutProps) {
  const { client } = props;
  const history = client.history.entries;

  // Get all components from all assistant responses
  const allComponents = history
    .filter((e) => e.type === "assistant_response")
    .flatMap((response) => response.components || []);

  // Filter for booking widgets
  const bookingWidgets = filterComponents(allComponents, {
    include: ["bookingwidget"],
  });

  return (
    <div className={styles.layout}>
      {/* LEFT - Booking Form */}
      <div className={styles.formColumn}>
        <div className={styles.formContainer}>
          {bookingWidgets.length > 0 ? (
            <div className={styles.formContent}>{bookingWidgets.map((c) => renderComponent(c))}</div>
          ) : (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingContent}>
                <div className={styles.skeletonContent}>
                  {/* Skeleton Header */}
                  <div className={styles.skeletonHeader}>
                    <div className={styles.skeletonTitle}></div>
                    <div className={styles.skeletonSubtitle}></div>
                  </div>

                  {/* Skeleton Service Info */}
                  <div className={styles.skeletonServiceInfo}>
                    <div className={styles.skeletonServiceLeft}>
                      <div className={styles.skeletonServiceName}></div>
                      <div className={styles.skeletonServiceDesc}></div>
                    </div>
                    <div className={styles.skeletonPriceBadge}></div>
                  </div>

                  {/* Skeleton Body */}
                  <div className={styles.skeletonBody}>
                    <div className={styles.skeletonLeft}>
                      <div className={styles.skeletonField}>
                        <div className={styles.skeletonLabel}></div>
                        <div className={styles.skeletonValue}></div>
                      </div>
                      <div className={styles.skeletonField}>
                        <div className={styles.skeletonLabel}></div>
                        <div className={styles.skeletonValue}></div>
                      </div>
                      <div className={styles.skeletonField}>
                        <div className={styles.skeletonLabel}></div>
                        <div className={styles.skeletonValue}></div>
                      </div>
                      <div className={styles.skeletonField}>
                        <div className={styles.skeletonLabel}></div>
                        <div className={styles.skeletonValue}></div>
                      </div>
                      <div className={styles.skeletonField}>
                        <div className={styles.skeletonLabel}></div>
                        <div className={styles.skeletonValue}></div>
                      </div>
                      <div className={styles.skeletonField}>
                        <div className={styles.skeletonLabel}></div>
                        <div className={styles.skeletonValue}></div>
                      </div>
                    </div>
                    <div className={styles.skeletonImage}></div>
                  </div>

                  {/* Skeleton Footer */}
                  <div className={styles.skeletonFooter}>
                    <div className={styles.skeletonButton}></div>
                    <div className={styles.skeletonButton}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT - Hero Section - Only show when loading */}
      {bookingWidgets.length === 0 && (
        <div className={styles.heroColumn}>
          <div className={styles.heroBackground}>
            <div className={styles.heroPattern}></div>
            <div className={styles.heroContent}>
              <div className={styles.heroInner}>
                <h2 className={styles.heroTitle}>Book Your Appointment</h2>
                <p className={styles.heroSubtitle}>
                  Expert care, personalized treatment, and flexible scheduling to fit your lifestyle.
                </p>

                {/* Feature list */}
                <div className={styles.featureList}>
                  <div className={styles.feature}>
                    <svg
                      className={styles.featureIcon}
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className={styles.featureTitle}>Instant Confirmation</p>
                      <p className={styles.featureText}>Get immediate booking confirmation</p>
                    </div>
                  </div>
                  <div className={styles.feature}>
                    <svg
                      className={styles.featureIcon}
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className={styles.featureTitle}>Flexible Scheduling</p>
                      <p className={styles.featureText}>Choose times that work for you</p>
                    </div>
                  </div>
                  <div className={styles.feature}>
                    <svg
                      className={styles.featureIcon}
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className={styles.featureTitle}>Expert Practitioners</p>
                      <p className={styles.featureText}>Qualified professionals ready to help</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
