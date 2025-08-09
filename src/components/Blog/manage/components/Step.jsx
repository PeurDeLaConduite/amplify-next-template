import React from "react";

export default function Step({ number, done, children }) {
    return (
        <div className="flex items-center gap-2 mb-1">
            <span
                className={`flex items-center justify-center w-6 h-6 rounded-full font-bold ${
                    done
                        ? "bg-green-500 text-white"
                        : "bg-blue-100 text-blue-600 border border-blue-400"
                }`}
            >
                {done ? "✓" : number}
            </span>
            <span className={done ? "text-green-700 font-medium" : "text-blue-900"}>
                {children}
            </span>
        </div>
    );
}
