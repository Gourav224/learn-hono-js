import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
import dbConnect from "./db/connectDB";
import VideosModel from "./db/video.model";

const app = new Hono();

//middleware
app.use(poweredBy());
app.use(logger());

dbConnect()
	.then(() => {
		// get list
		app.get("/", async (c) => {
			const doc = await VideosModel.find();
			return c.json(
				{
					message: "",
					data: doc.map((d) => d.toObject()),
				},
				200,
			);
		});

		//create doc

		app.post("/", async (c) => {
			const formData = await c.req.json();
			console.log(formData);
			if (!formData.thumbnailUrl) delete formData.thumbnailUrl;
			const doc = await VideosModel.create(formData);
			return c.json(
				{
					message: "Video created successfully",
					data: doc.toObject(),
				},
				201,
			);
		});

		//get by id
		app.get("/:id", async (c) => {
			const id = c.req.param("id");
			const doc = await VideosModel.findById(id);
			if (!doc) {
				return c.json(
					{
						message: "Video not found",
					},
					404,
				);
			}
			return c.json(
				{
					message: "",
					data: doc.toObject(),
				},
				200,
			);
		});

		// edit the doc
		app.put("/:id", async (c) => {
			const id = c.req.param("id");
			const formData = await c.req.json();
			const doc = await VideosModel.findByIdAndUpdate(id, formData, {
				new: true,
			});
			if (!doc) {
				return c.json(
					{
						message: "Video not found",
					},
					404,
				);
			}
			return c.json(
				{
					message: "Video updated successfully",
					data: doc.toObject(),
				},
				200,
			);
		});
		// delete the doc
		app.delete("/:id", async (c) => {
			const id = c.req.param("id");
			const doc = await VideosModel.findByIdAndDelete(id);
			if (!doc) {
				return c.json(
					{
						message: "Video not found",
					},
					404,
				);
			}
			return c.json(
				{
					message: "Video deleted successfully",
					data: doc.toObject(),
				},
				200,
			);
		});
		app.get("/*", (c) => {
			return c.json(
				{
					message: "Not Found",
				},
				404,
			);
		});
    
	})
	.catch((err) => {
		app.get("/*", (c) => {
			return c.json(
				{
					message: "Error connecting to MongoDB",
					error: err.message,
				},
				500,
			);
		});
		console.log(err);
	});

app.onError((err, c) => {
	return c.json(
		{
			message: "Internal Server Error",
			error: err.message,
		},
		500,
	);
});
export default app;
