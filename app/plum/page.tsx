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
    const [chatResponse, setChatResponse] = useState<string>('');
    const [savedQuestion, setSavedQuestion] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handlePlum = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSavedQuestion(query);
        setChatResponse('');

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
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: savedQuestion,
                    hexagram: result?.hexagramName,
                    mutual: result?.mutualName,
                    flipped: result?.flippedName,
                }),
            });
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedResponse += chunk;
                setChatResponse(accumulatedResponse);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Plum Blossom Numerology</h1>
                <p>梅花易数</p>
            </div>
            <form onSubmit={handlePlum} className={styles.plumForm}>
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your question..."
                    className={styles.plumInput}
                />
                <button type="submit" className={styles.plumSubmit}>Generate Hexagram</button>
            </form>
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
                    <button onClick={handleSubmit} className={styles.chatSubmit}>Ask</button>
                    {chatResponse && (
                        <div className={styles.chatResponse}>
                            <h2>Chat Response</h2>
                            <div>{chatResponse}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
