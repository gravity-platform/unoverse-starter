import React from "react";
import styles from "../BookingWidget.module.css";

interface ServiceInfoProps {
  service?: string;
  serviceDescription?: string;
  price?: string;
}

export default function ServiceInfo({ service, serviceDescription, price }: ServiceInfoProps) {
  return (
    <div className={styles.serviceInfo}>
      <div className={styles.serviceHeader}>
        <div>
          <h3 className={styles.serviceName}>{service || "Appointment"}</h3>
          {serviceDescription && (
            <p className={styles.serviceDescription}>{serviceDescription}</p>
          )}
        </div>
        {price && (
          <div className={styles.priceBadge}>
            <div className={styles.priceText}>{price}</div>
          </div>
        )}
      </div>
    </div>
  );
}
