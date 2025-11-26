import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
// The following line is removed as Vite is now run separately:
// import { setupVite, serveStatic, log } from "./vite"; 

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf: Buffer | string) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      // Replaced log() with console.log()
      console.log(logLine); 
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // The conditional block that used to call setupVite() and serveStatic() 
  // in development is REMOVED because the frontend runs separately.
  
  // NOTE: If your production logic requires serveStatic(app), you need to 
  // reintroduce that for the 'production' environment check.
  // Example for production (untested, depends on your original file structure):
  if (app.get("env") !== "development") {
    // Make sure 'serveStatic' is available, or manually serve static assets
    // if using this block:
    // serveStatic(app);
  }

  // Set default port to 8000 to avoid conflicts and ENOTSUP error on 5000.
  const port = parseInt(process.env.PORT || '8000', 10);
  server.listen({
    port,
    host: "127.0.0.1", // Uses the safer loopback address
    // 'reusePort' is REMOVED to avoid socket issues
  }, () => {
    // Replaced log() with console.log()
    console.log(`serving API on port ${port}`);
  });
})();