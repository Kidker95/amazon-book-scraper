import { appConfig } from "../2-utils/app-config";
import { BookModel } from "../3-models/book-model";
import puppeteer, { Browser } from "puppeteer";
import { socketService } from './socket-service';

class ScrapingService {

    public async scrapeBooks(text: string, socketId: string): Promise<BookModel[]> {

        let browser: Browser;

        try {
            if (!text.trim()) { throw new Error("Search text cannot be empty."); }

            const books: BookModel[] = [];

            // Create browser
            socketService.sendMessage("Creating a browser...", socketId);

            // if production = true, i will see the browser
            browser = await puppeteer.launch({ headless: appConfig.isProduction });

            // Create page
            socketService.sendMessage("Creating a new page...", socketId);

            const page = await browser.newPage();

            // Amazon Books page
            const url = `https://www.amazon.com/b/ref=usbk_surl_books/?node=283155`;
            socketService.sendMessage("Browsing Amazon Books...", socketId);

            // wait until traffic is ended
            await page.goto(url, { waitUntil: "networkidle2" });

            //  1. wait for input to open up
            await page.waitForSelector("input#twotabsearchtextbox");

            //  2. type text in the input
            await page.type("input#twotabsearchtextbox", text);

            //  3. hit "enter" key
            await page.keyboard.press("Enter");

            // 4. wait for end of traffic (ie the search ended)
            await page.waitForNavigation({ waitUntil: "networkidle2" });

            //  5. wait for book selector: 
            // await page.waitForSelector("div[data-cy='title-recipe']");
            await page.waitForSelector("div.puis-card-container");

            //  6. scrape cards:
            const cards = await page.$$("div.puis-card-container");

            //  7. run on all cards:
            for (const card of cards) {
                // book.name
                const nameElement = await card.$("h2 > span");
                const name = await nameElement?.evaluate(element => element.innerText);
                socketService.sendMessage(`Found: '${name}'`, socketId);

                // book.price
                let priceElement = await card.$("span.a-price > span.a-offscreen");
                if (!priceElement) priceElement = await card.$("div[data-cy='secondary-offer-recipe'] > div > span:nth-of-type(2)");
                let price = await priceElement?.evaluate(element => element.innerText);
                if (!price) price = "---";


                // book.author
                let authorElement = await card.$("div[data-cy='title-recipe'] > div > a");
                let author = await authorElement?.evaluate(element => element.innerText);
                if (!author) author = "---"


                // book.imageUrl
                let imageUrlElement = await card.$("img.s-image")
                let imageUrl = await imageUrlElement?.evaluate(element => element.src);
                if (!imageUrl) imageUrl = "---"

                const book = new BookModel(name, price, author, imageUrl);
                socketService.sendMessage(`Found ${books.length} books`, socketId);
                books.push(book);

            }

            await browser.close();
            return books;
        }
        finally { await browser.close(); }
    }


}

export const scrapingService = new ScrapingService();
