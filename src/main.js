import "../src/styles.css";
import { decode } from "blurhash";

class App {
	constructor() {
		this.imageGrid = document.getElementById("imageGrid");
		this.observerTarget = document.getElementById("observerTarget");
		this.loading = true;
		this.page = 1;
		this.per_page = window.innerWidth >= 1345 ? 8 : 6;
		this.imageSize = null;
		this.setupIntersectionObserver();
		this.fetchImages();
	}

	async fetchImages() {
		try {
			const response = await fetch(
				`https://api.unsplash.com/collections/Lyz89J_lfpY/photos?per_page=${this.per_page}&page=${this.page}`,
				{
					headers: {
						Authorization: `Client-ID ${UNSPLASH_KEY}`,
					},
				}
			);
			let data = await response.json();
			if (data.errors) {
				throw data.errors[0];
			}
			this.renderImages(data);
		} catch (error) {
			this.renderError(error);
			console.error("Error fetching images:", error);
			this.loading = false;
		} finally {
			this.loading = false;
		}
	}
	generatePrice() {
		return `$${(Math.random() * 100 + 20).toFixed(2)}`;
	}

	getImageSize(imageContainer) {
		const { width, height } = imageContainer.getBoundingClientRect();
		this.imageSize = { width: parseInt(width), height: parseInt(height) };
		return this.imageSize;
	}

	getImageBlur(blurHash, width, height) {
		console.log(this.itemsToFetchCount, window.innerWidth);
		console.log(width, height);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const imageData = ctx.createImageData(width, height);

		const pixels = decode(blurHash, width, height);

		imageData.data.set(pixels);
		ctx.putImageData(imageData, 0, 0);
		return canvas.toDataURL();
	}
	renderError(error) {
		const errorParagraph = document.createElement("p");
		errorParagraph.className = "error";
		errorParagraph.innerHTML = error;
		document.body.appendChild(errorParagraph);
	}

	renderImages(images) {
		let i = 0;

		images?.forEach((image) => {
			const imageWraper = document.createElement("div");
			imageWraper.className = "image-wraper";
			imageWraper.setAttribute("data-id", image.id);
			const imageContainer = document.createElement("div");
			imageContainer.className = "image-container";

			const productInfo = document.createElement("div");
			productInfo.className = "product-info";
			const title = document.createElement("h3");
			title.className = "product-title";
			title.textContent = image.description || image.alt_description || "-";

			const price = document.createElement("div");
			price.className = "product-price";
			price.textContent = this.generatePrice();

			const img = document.createElement("img");
			img.className = "lazy-image";
			img.alt = image.alt_description || "Product";
			img.loading = "lazy";

			productInfo.appendChild(title);
			productInfo.appendChild(price);
			imageWraper.appendChild(imageContainer);
			imageWraper.appendChild(productInfo);
			this.imageGrid.appendChild(imageWraper);

			const positionInfo = this.imageSize
				? this.imageSize
				: this.getImageSize(imageContainer);

			imageContainer.style.backgroundImage = `url(${this.getImageBlur(
				image.blur_hash,
				positionInfo.width,
				positionInfo.height
			)})`;
			img.src = image.urls.regular;
			imageContainer.appendChild(img);
			window.setTimeout(() => {
				imageWraper.classList.add("appear");
			}, i);
			i += 200;
		});
		i = 0;
	}

	setupIntersectionObserver() {
		const observer = new IntersectionObserver(
			(entries) => {
				const target = entries[0];
				if (target.isIntersecting && !this.loading) {
					this.page++;
					this.fetchImages();
				}
			},
			{
				rootMargin: "100px",
				threshold: 0.1,
			}
		);

		observer.observe(this.observerTarget);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	new App();
});
