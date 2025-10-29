import { Controller, Get, Post, Body, Query, UseGuards } from "@nestjs/common";
import { QueryService, QueryOptions } from "./query.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("query")
@UseGuards(JwtAuthGuard)
export class QueryController {
  constructor(private queryService: QueryService) {}

  @Get("categories")
  getCategories() {
    return this.queryService.getCategories();
  }

  @Get("statuses")
  getStatuses() {
    return this.queryService.getStatuses();
  }

  @Get("types")
  getTypes() {
    return this.queryService.getTypes();
  }

  @Get("search")
  search(@Query() options: QueryOptions) {
    return this.queryService.query(options);
  }
  @Post("test-data")
  postTestData(@Body() body: { num: number }) {
    if (body.num !== 100) {
      throw new Error("num must be 100");
    }
    return this.queryService.postTestData(body.num);
  }
}
