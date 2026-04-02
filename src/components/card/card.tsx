import React from 'react';
import styles from './card.module.css';

export type GameCardVariant = 'hero' | 'small' | 'medium';

export interface GameCardProps {
  variant?: GameCardVariant;
  title: string;
  subtitle: string;
  /** Mini preview (e.g. Word Search grid). When set, `imageSrc` is ignored. */
  preview?: React.ReactNode;
  /** Preview image path (e.g. `/previews/klondike.png`). Omit when using `preview`. */
  imageSrc?: string;
  imageAlt: string;
  playLabel: string;
  bestScore?: number;
  onPlay: () => void;
  onHowToPlay: (e: React.MouseEvent) => void;
}

export function GameCard({
  variant = 'small',
  title,
  subtitle,
  preview,
  imageSrc,
  imageAlt,
  playLabel,
  bestScore,
  onPlay,
  onHowToPlay,
}: GameCardProps) {
  const isHero = variant === 'hero';
  const isCompact = variant === 'small' || variant === 'medium';

  const cardClass = [
    styles.card,
    variant === 'hero' && styles.variantHero,
    variant === 'small' && styles.variantSmall,
    variant === 'medium' && styles.variantMedium,
  ]
    .filter(Boolean)
    .join(' ');

  const mediaClass = [
    styles.media,
    variant === 'hero' && styles.mediaHero,
    variant === 'small' && styles.mediaSmall,
    variant === 'medium' && styles.mediaMedium,
  ]
    .filter(Boolean)
    .join(' ');

  const bodyClass = [styles.body, isHero ? styles.bodyHero : styles.bodyCompact]
    .filter(Boolean)
    .join(' ');

  const playClass = [styles.playBtn, isHero ? styles.playBtnHero : styles.playBtnCompact]
    .filter(Boolean)
    .join(' ');

  const howClass = [styles.howTo, isHero ? styles.howToHero : styles.howToCompact]
    .filter(Boolean)
    .join(' ');

  const titleClass = [styles.title, isHero ? styles.titleHero : styles.titleCompact]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={cardClass}>
      <div
        className={mediaClass}
        onClick={onPlay}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPlay();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${playLabel}: ${title}`}
      >
        {preview ? (
          <div className={styles.previewCustom}>{preview}</div>
        ) : (
          imageSrc && (
            <img
              src={imageSrc}
              alt={imageAlt}
              className={styles.previewImage}
              loading="lazy"
            />
          )
        )}
      </div>

      <div className={bodyClass}>
        <h3 className={titleClass}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
        {bestScore != null && (
          <p className={styles.best}>Best: {bestScore}</p>
        )}
        {isCompact ? (
          <div className={styles.footerRow}>
            <button type="button" className={howClass} onClick={onHowToPlay}>
              <span className={styles.howToIcon} aria-hidden>
                📜
              </span>
              How to Play
            </button>
            <button type="button" className={playClass} onClick={onPlay}>
              {playLabel}
            </button>
          </div>
        ) : (
          <>
            <button type="button" className={playClass} onClick={onPlay}>
              {playLabel}
            </button>
            <button type="button" className={howClass} onClick={onHowToPlay}>
              <span className={styles.howToIcon} aria-hidden>
                📜
              </span>
              How to Play
            </button>
          </>
        )}
      </div>
    </article>
  );
}
