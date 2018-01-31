import { Injectable } from "@angular/core";
import { ArticleType } from "../shared/server/rest-api.model";

@Injectable()
export class ArticleSerieService {
  articleType: ArticleType;
}
