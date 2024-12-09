import { model, Schema } from "mongoose";

export interface IVideoSchema {
	title: string;
	descrption: string;
	thumbnailUrl?: string;
	watched?: boolean;
	videoUrl: string;
	channel: string;
}

const videoSchema = new Schema<IVideoSchema>({
	title: { type: String, required: true },
	descrption: { type: String, required: true },
	thumbnailUrl: {
		type: String,
		default:
			"https://th.bing.com/th/id/OIP.2bJ9_f9aKoGCME7ZIff-ZwHaJ4?rs=1&pid=ImgDetMain",
	},
	watched: { type: Boolean, default: false },
	videoUrl: { type: String, required: true },
	channel: { type: String, required: true },
});

const VideosModel = model<IVideoSchema>("Video", videoSchema);

export default VideosModel;
