import { Controller, Get, Res, Req } from "../shop/node_modules/@nestjs/common";
import { join } from "node:path";
import {
	type Response,
	type Request,
} from "../shop/node_modules/@types/express";
import { GalleryService } from "./app.service";

@Controller()
export class AppController {
	@Get()
	landingPage(@Res() res: Response) {
		return res.sendFile(join(`${process.cwd()}/src/static`));
	}
}

@Controller()
export class GalleryController {
	constructor(private readonly galleryService: GalleryService) {}

	@Get("/gallery")
	async gallery(@Res() res: Response, @Req() req: Request) {
		const { per_page, page } = req.query;
		const resa = await this.galleryService.findAll(per_page, page);
		return res.send(resa.data);
	}
}
