'use client';
import { ReactNode } from 'react';
import styles from './page.module.scss';

interface PlumLayoutProps {
  children?: ReactNode;
  header: ReactNode;
  form: ReactNode;
  loading?: ReactNode;
  error?: ReactNode;
  results?: ReactNode;
}

export default function PlumLayout({
  children,
  header,
  form,
  loading,
  error,
  results
}: PlumLayoutProps) {
  return (
    <div className={styles.plumPage}>
      {header}
      {form}
      {loading}
      {error}
      {results}
      {children}
    </div>
  );
}
