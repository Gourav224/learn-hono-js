import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { v4 as uuidv4 } from "uuid";

let videos = [];

const app = new Hono();

app.get("/", (c) => {
	return c.html("<h1>Jai Shree Ram</h1>");
});

app.post("/video", async (c) => {
	const { videoName, channelName, duration } = await c.req.json();

	const newVideo = {
		videoName,
		channelName,
		duration,
		id: uuidv4(),
	};
	videos.push(newVideo);
	return c.json(newVideo);
});

app.get("/videos", (c) => {
	console.log("videos", videos);
	return streamText(c, async (stream) => {
		for (const video of videos) {
			await stream.writeln(JSON.stringify(video));
			await stream.sleep(500);
			await stream.writeln("Jai Shree Ram");
		}
	});
});

app.get("/videos/:id", (c) => {
	const { id } = c.req.param();
	const video = videos.find((video) => video.id === id);
	if (!video) {
		return c.json({ message: "Video not found" }, 404);
	}
	return c.json(video);
});

app.put("/videos/:id", async (c) => {
	const { id } = c.req.param();
	const index = videos.findIndex((video) => video.id === id);

	if (index === -1) {
		return c.json({ message: "Video not found" }, 404);
	}
	const { videoName, channelName, duration } = await c.req.json();
	if (videoName) videos[index].videoName = videoName;
	if (channelName) videos[index].channelName = channelName;
	if (duration) videos[index].duration = duration;

	return c.json(videos[index]);
});

app.delete("/videos/:id", (c) => {
	const { id } = c.req.param();
	const index = videos.findIndex((video) => video.id === id);
	if (index === -1) {
		return c.json({ message: "Video not found" }, 404);
	}
	videos.splice(index, 1);
	return c.json({ message: "Video deleted" });
});
app.delete("/videos", (c) => {
    videos = [];
    return c.json({
        message: "All videos deleted",
    });
});

export default app;
