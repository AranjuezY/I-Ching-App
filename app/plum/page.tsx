'use client';
import { useState } from 'react';
import Plum from '../components/plum/plum';
import { plumGenerator } from '@/lib/utils/plum';
import styles from './page.module.scss';

export default function Page() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<{
        hexagram: string;
        hexagramName: string | null;
        hexagramTuanci: string | null;
        mutual: string;
        mutualName: string | null;
        mutualTuanci: string | null;
        flipped: string;
        flippedName: string | null;
        flippedTuanci: string | null;
        flipId: number | 0; // Not being used.
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const generated = plumGenerator();
            const params = new URLSearchParams({
                hexagram: generated.hexagram[0],
                mutual: generated.mutual[0],
                flipped: generated.flipped[0],
            });

            const response = await fetch(`/api/plum?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch plum data');
            }
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Plum Blossom Numerology</h1>
                <p>梅花易数</p>
            </div>
            <form onSubmit={handleSubmit} className={styles.plumForm}>
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your question..."
                    className={styles.plumInput}
                    disabled={loading}
                />
                <button 
                    type="submit" 
                    className={styles.plumSubmit}
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Hexagram'}
                </button>
            </form>
            {loading && <div className={styles.loading}>Generating hexagram...</div>}
            {error && <div className={styles.error}>{error}</div>}
            {result && (
                <div className={styles.results}>
                    <Plum
                        hexagram={result.hexagram}
                        hexagramName={result.hexagramName}
                        hexagramTuanci={result.hexagramTuanci}
                        mutual={result.mutual}
                        mutualName={result.mutualName}
                        mutualTuanci={result.mutualTuanci}
                        flipped={result.flipped}
                        flippedName={result.flippedName}
                        flippedTuanci={result.flippedTuanci}
                        flipId={result.flipId}
                    />
                </div>
            )}
        </div>
    );
}
