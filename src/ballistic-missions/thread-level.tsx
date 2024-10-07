import type { ThreadLevels } from './thread-levels';

interface ThreadLevelProps {
    level: ThreadLevels;
}

export function ThreadLevel({ level }: ThreadLevelProps) {
    const THREAD_RATES = {
        LOW: (
            <span className="font-bold text-green-500">Thread Level: LOW</span>
        ),
        MEDIUM: (
            <span className="font-bold text-yellow-300">
                Thread Level: MEDIUM
            </span>
        ),
        HIGH: (
            <span className="font-bold text-red-600">Thread Level: HIGH</span>
        ),
    };

    return THREAD_RATES[level];
}
