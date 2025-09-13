import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: "Neatnest API is working!",
      version: "1.0.0",
    };
  }
}
