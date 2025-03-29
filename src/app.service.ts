import { Injectable } from "../shop/node_modules/@nestjs/common";
import { HttpService } from "../shop/node_modules/@nestjs/axios";
import { AxiosResponse } from "axios";

@Injectable()
export class AppService {
	getHello(): string {
		return "Hello World!";
	}
}

@Injectable()
export class GalleryService {
	constructor(private readonly httpService: HttpService) {}

	async findAll(per_page, page): Promise<AxiosResponse<unknown>> {
		const res = this.httpService.axiosRef.get(
			`https://api.unsplash.com/collections/Lyz89J_lfpY/photos?per_page=${per_page}&page=${page}`,
			{
				headers: {
					Authorization: `Client-ID ${process.env.API_KEY}`,
				},
			}
		);
		return res;
	}
}
