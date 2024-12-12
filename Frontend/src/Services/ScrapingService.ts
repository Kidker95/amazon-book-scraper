import axios from "axios";
import { BookModel } from "../Models/BookModel";
import { appConfig } from "../Utils/AppConfig";
import { socketService } from "./SocketService";

class ScrapingService {

    public async scrapBooks(text: string): Promise<BookModel[]> {
        text = encodeURI(text);
        const response = await axios.get<BookModel[]>(appConfig.scrapeBookUrl + text + "/" + socketService.socketId);
        const books = response.data;
        return books;
    }

}

export const scrapingService = new ScrapingService();

