// /hooks/useAutoRefresh.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type BackoffOptions = {
    /** délai min en ms (ex: 1_000) */
    min: number;
    /** délai max en ms (ex: 60_000) */
    max: number;
    /** facteur multiplicatif (ex: 2) */
    factor: number;
};

export type UseAutoRefreshOptions<T> = {
    /** Fonction qui retourne tes données (ex: () => client.models.Todo.list().then(r => r.data ?? [])) */
    fetcher: () => Promise<T[]>;
    /** Intervalle de base en ms (par défaut 15000) */
    intervalMs?: number;
    /** Lancement auto (true par défaut) */
    enabled?: boolean;
    /** Faire une requête immédiate au montage (true par défaut) */
    initialFetch?: boolean;
    /** Évite les rafraîchissements si une requête est déjà en cours (true par défaut) */
    dedupe?: boolean;
    /** Pause quand l’onglet est masqué (true par défaut) */
    pauseWhenHidden?: boolean;
    /** Re-fetch au focus (true par défaut) */
    refetchOnFocus?: boolean;
    /** Re-fetch au retour en ligne (true par défaut) */
    refetchOnReconnect?: boolean;
    /** Ajoute un jitter aléatoire ±10% sur l’intervalle (false par défaut) */
    jitter?: boolean;
    /** Backoff sur erreurs (désactivé si non fourni) */
    backoff?: BackoffOptions;
    /** Callback d’erreur */
    onError?: (err: unknown) => void;
};

export type UseAutoRefreshState<T> = {
    data: T[];
    error: unknown | null;
    loading: boolean;
    lastUpdated: number | null;
    /** Forcer une requête maintenant */
    refetch: () => Promise<void>;
    /** Démarrer le polling */
    start: () => void;
    /** Arrêter le polling */
    stop: () => void;
    /** Le polling tourne-t-il ? */
    isRunning: boolean;
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export function useAutoRefresh<T>(opts: UseAutoRefreshOptions<T>): UseAutoRefreshState<T> {
    const {
        fetcher,
        intervalMs = 15_000,
        enabled = true,
        initialFetch = true,
        dedupe = true,
        pauseWhenHidden = true,
        refetchOnFocus = true,
        refetchOnReconnect = true,
        jitter = false,
        backoff,
        onError,
    } = opts;

    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState<unknown | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<number | null>(null);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mountedRef = useRef<boolean>(false);
    const fetchingRef = useRef<boolean>(false);
    const stoppedRef = useRef<boolean>(false);

    // état backoff
    const backoffDelayRef = useRef<number>(backoff ? backoff.min : intervalMs);

    const clearTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const scheduleNext = useCallback(
        (base: number) => {
            if (!enabled || stoppedRef.current) return;
            let next = base;
            if (jitter) {
                // ±10%
                const delta = base * 0.1;
                next = Math.round(base + (Math.random() * 2 - 1) * delta);
            }
            clearTimer();
            timerRef.current = setTimeout(() => void doFetch(), next);
        },
        [enabled, jitter]
    );

    const doFetch = useCallback(async () => {
        if (stoppedRef.current || !enabled) return;

        if (dedupe && fetchingRef.current) {
            // une requête est déjà en cours, on replanifie
            scheduleNext(intervalMs);
            return;
        }

        fetchingRef.current = true;
        setLoading(true);
        try {
            const result = await fetcher();
            if (!mountedRef.current) return;

            setData(result);
            setError(null);
            setLastUpdated(Date.now());
            // reset backoff si succès
            backoffDelayRef.current = backoff ? backoff.min : intervalMs;
            scheduleNext(intervalMs);
        } catch (err) {
            if (!mountedRef.current) return;
            setError(err);
            onError?.(err);

            if (backoff) {
                // applique l’exponentiel
                const nextDelay = clamp(
                    Math.round(backoffDelayRef.current * backoff.factor),
                    backoff.min,
                    backoff.max
                );
                backoffDelayRef.current = nextDelay;
                scheduleNext(nextDelay);
            } else {
                // pas de backoff → on garde l’intervalle normal
                scheduleNext(intervalMs);
            }
        } finally {
            fetchingRef.current = false;
            setLoading(false);
        }
    }, [enabled, dedupe, fetcher, intervalMs, onError, backoff, scheduleNext]);

    const refetch = useCallback(async () => {
        // refetch immédiat (ignore le timer actuel)
        clearTimer();
        await doFetch();
    }, [doFetch]);

    const start = useCallback(() => {
        stoppedRef.current = false;
        setIsRunning(true);
        clearTimer();
        // lance immédiatement si pas de initialFetch (sinon ce sera fait au montage)
        if (!initialFetch) scheduleNext(intervalMs);
    }, [initialFetch, intervalMs, scheduleNext]);

    const stop = useCallback(() => {
        stoppedRef.current = true;
        setIsRunning(false);
        clearTimer();
    }, []);

    // focus/visibility/online events
    useEffect(() => {
        const onFocus = () => {
            if (!enabled || stoppedRef.current) return;
            if (refetchOnFocus) void refetch();
        };
        const onVisibility = () => {
            if (!enabled) return;
            if (document.visibilityState === "hidden" && pauseWhenHidden) {
                stop();
            } else if (document.visibilityState === "visible") {
                if (!isRunning) start();
                if (pauseWhenHidden) void refetch();
            }
        };
        const onOnline = () => {
            if (!enabled || stoppedRef.current) return;
            if (refetchOnReconnect) void refetch();
        };

        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("online", onOnline);

        return () => {
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onVisibility);
            window.removeEventListener("online", onOnline);
        };
    }, [
        enabled,
        refetchOnFocus,
        pauseWhenHidden,
        refetchOnReconnect,
        refetch,
        start,
        stop,
        isRunning,
    ]);

    // démarrage / arrêt selon enabled
    useEffect(() => {
        mountedRef.current = true;

        // reset flags
        stoppedRef.current = !enabled;
        setIsRunning(enabled);

        if (enabled) {
            if (initialFetch) {
                void doFetch();
            } else {
                scheduleNext(intervalMs);
            }
        }

        return () => {
            mountedRef.current = false;
            clearTimer();
            fetchingRef.current = false;
            stoppedRef.current = true;
            setIsRunning(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, initialFetch, intervalMs]); // volontairement limité

    return {
        data,
        error,
        loading,
        lastUpdated,
        refetch,
        start,
        stop,
        isRunning,
    };
}

/*
Exemple d’usage avec Amplify Gen 2 (Todo) 

// src/app/todos/page.tsx
"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { useMemo } from "react";

const client = generateClient<Schema>();

export default function TodosPage() {
  // On passe un fetcher pur (aucun WebSocket utilisé)
  const fetcher = useMemo(
    () => async () => {
      const { data } = await client.models.Todo.list({
        // tri par date de création décroissante
        sort: (s) => s.createdAt("DESC"),
      });
      return data ?? [];
    },
    []
  );

  const {
    data: todos,
    loading,
    error,
    lastUpdated,
    refetch,
    start,
    stop,
    isRunning,
  } = useAutoRefresh({
    fetcher,
    intervalMs: 15_000,           // ⏱️ toutes les 15s
    initialFetch: true,            // 1er fetch immédiat
    pauseWhenHidden: true,         // pause si onglet caché
    refetchOnFocus: true,          // re-fetch au focus
    refetchOnReconnect: true,      // re-fetch au retour en ligne
    jitter: true,                  // évite l’effet troupeau si bcp d’onglets
    backoff: { min: 1_000, max: 60_000, factor: 2 }, // backoff progressif si erreurs
    onError: (e) => console.error("Todos refresh error:", e),
  });

  return (
    <main className="p-6 space-y-4">
      <header className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Mes tâches</h1>
        <button onClick={refetch} className="px-3 py-1 rounded border">
          Rafraîchir
        </button>
        {isRunning ? (
          <button onClick={stop} className="px-3 py-1 rounded border">
            Pause auto
          </button>
        ) : (
          <button onClick={start} className="px-3 py-1 rounded border">
            Reprendre auto
          </button>
        )}
      </header>

      <div className="text-sm opacity-70">
        {loading ? "Chargement..." : `Dernière mise à jour : ${lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "—"}`}
        {error && <span className="text-red-600 ml-2">Erreur de chargement</span>}
      </div>

      <ul className="list-disc pl-5 space-y-1">
        {todos.map((t) => (
          <li key={t.id}>{t.content}</li>
        ))}
      </ul>
    </main>
  );
}


*/