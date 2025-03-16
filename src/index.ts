import path from 'path';
import {getFilesMapAsync} from "./files";

const port = process.env.PORT ?? 3000;
const base = process.env.DIR_2142;
if (!base) {
	throw new Error("Environment variable DIR_2142 is not set");
}

const map = await Array.fromAsync(getFilesMapAsync(base));

const server = Bun.serve({
	port,
	routes: {
		"/api/status": new Response("OK"),
		"/api/file/map": async req => {
			try {
				return Response.json(map);
			} catch (err) {
				return new Response("Unable to read game files directory", { status: 500 });
			}
		},
		"/api/file/get": req => {
			const url = new URL(req.url);
			const name = url.searchParams.get("name");
			if (!name) {
				return new Response("Missing name", { status: 400 });
			}

			const target = path.join(__dirname, base, name)

			const file = Bun.file(target);
			return new Response(file);
		},
	},
});

console.log(`Listening on ${server.url}`);