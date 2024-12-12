class AppConfig {
    private readonly baseUrl = process.env.REACT_APP_BASE_URL;
	public readonly scrapeBookUrl = this.baseUrl + "api/scrape-books/";
}

export const appConfig = new AppConfig();
