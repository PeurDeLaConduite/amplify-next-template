import fs from "node:fs";
import path from "node:path";

export function ensureDir(p: string) {
    fs.mkdirSync(p, { recursive: true });
}

export function safeWrite(file: string, content: string, force = false) {
    ensureDir(path.dirname(file));

    if (!force) {
        try {
            const current = fs.readFileSync(file, "utf-8");
            if (current === content) {
                return;
            }
        } catch (err) {
            if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
                throw err;
            }
        }
    }

    fs.writeFileSync(file, content, "utf-8");
}

export async function writeJSON(file: string, data: unknown, force = false) {
    ensureDir(path.dirname(file));
    const content = JSON.stringify(data, null, 2);

    if (!force) {
        try {
            const current = await fs.promises.readFile(file, "utf-8");
            if (current === content) {
                return;
            }
        } catch (err) {
            if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
                throw err;
            }
        }
    }

    await fs.promises.writeFile(file, content, "utf-8");
}
