import { extname } from "https://deno.land/std@0.177.0/path/posix.ts";
import { typeByExtension } from "https://deno.land/std@0.224.0/media_types/type_by_extension.ts";

const staticPath = Deno.cwd() + "/dist/pixel-art/browser/";

Deno.serve(async (req) => {
    let path = new URL(req.url).pathname;

    if (path.endsWith("/")) {
        path += "/index.csr.html";
    }

    let file;

    try {
        file = await Deno.open(staticPath + path);
    } catch (_) {
        try {
            file = await Deno.open(staticPath + "index.csr.html");
        } catch (ex) {
            console.log(ex);
            if (ex.code === "ENOENT") {
                return new Response("Not Found", { status: 404 });
            }
            return new Response("Internal Server Error", { status: 500 });
        }
    }
    return new Response(file.readable, {
        headers: {
            "content-type": typeByExtension(extname(path)),
        },
    });
});

// Функция для отправки GET-запросов
async function sendGetRequests() {
    const endpoints = ["https://pixelart-api.onrender.com"];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint);
            const data = await response.text(); // или response.json() в зависимости от ожидаемого формата
            console.log(`Response from ${endpoint}:`, data);
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
        }
    }
}

const INTERVAL_DURATION = 5 * 60 * 1000; // 5 минут

// Отправка GET-запросов каждые 10 секунд
setInterval(sendGetRequests, INTERVAL_DURATION);
