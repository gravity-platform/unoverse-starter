/**
 * ConnectToAgentButton - Button to initiate live agent connection
 *
 * Shows a simple button to connect to a live agent.
 * Can be expanded to include a form for customer info.
 */

import React, { useState } from "react";
import type { CustomerInfo } from "../types";
import styles from "./ConnectToAgentButton.module.css";

export interface ConnectToAgentButtonProps {
  /** Callback when user wants to connect */
  onConnect: (customerInfo: CustomerInfo) => void;
  /** Whether currently connecting */
  isConnecting?: boolean;
  /** Pre-filled customer info */
  defaultCustomerInfo?: CustomerInfo;
}

export function ConnectToAgentButton({ onConnect, isConnecting, defaultCustomerInfo }: ConnectToAgentButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState(defaultCustomerInfo?.name || "");
  const [email, setEmail] = useState(defaultCustomerInfo?.email || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConnect({ name: name.trim(), email: email.trim() || undefined });
    }
  };

  // If we have default customer info, connect directly
  const handleQuickConnect = () => {
    if (defaultCustomerInfo?.name) {
      onConnect(defaultCustomerInfo);
    } else {
      setShowForm(true);
    }
  };

  if (showForm) {
    return (
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formHeader}>
            <span>Connect to Live Agent</span>
            <button type="button" className={styles.closeButton} onClick={() => setShowForm(false)}>
              ✕
            </button>
          </div>

          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
            autoFocus
          />

          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />

          <button type="submit" className={styles.submitButton} disabled={!name.trim() || isConnecting}>
            {isConnecting ? "Connecting..." : "Connect"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <button className={styles.connectButton} onClick={handleQuickConnect} disabled={isConnecting}>
      {isConnecting ? (
        <>
          <span className={styles.spinner} />
          Connecting...
        </>
      ) : (
        <>
          <span className={styles.icon}>👤</span>
          Talk to a Person
        </>
      )}
    </button>
  );
}

export default ConnectToAgentButton;
