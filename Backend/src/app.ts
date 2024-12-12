import cors from "cors";
import express, { Express } from "express";
import { appConfig } from "./2-utils/app-config";
import { errorMiddleware } from "./6-middleware/error-middleware";
import { scrapingController } from "./5-controllers/scraping-controller";
import { Server as HttpServer } from "http";
import { socketService } from "./4-services/socket-service";

class App {

    public expressServer: Express; // Make server public for the testing.

    public start(): void {

        // Create the server: 
        this.expressServer = express();

        this.expressServer.use(cors()); // Enabling CORS for any frontend address.

        // Tell express to create a request.body object from the body json:
        this.expressServer.use(express.json());

        // Connect controllers to the server:
        this.expressServer.use("/api", scrapingController.router);

        // Register route not found middleware: 
        this.expressServer.use("*", errorMiddleware.routeNotFound);

        // Register catch-all middleware: 
        this.expressServer.use(errorMiddleware.catchAll);

        const httpServer: HttpServer = this.expressServer.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));

        socketService.init(httpServer);
    }

}

export const app = new App(); // export app for the testing.
app.start();

