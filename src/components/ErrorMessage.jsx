import styles from './ErrorMessage.module.css';

function ErrorMessage({ message, onRetry, actionLabel = 'Try again', compact = false }) {
  return (
    <div className={`${styles.error} ${compact ? styles.compact : ''}`} role="alert">
      <span className={styles.icon} aria-hidden="true">!</span>
      <p>{message}</p>
      {onRetry && (
        <button className={styles.button} type="button" onClick={onRetry}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
