import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { ArticlesResource } from '../shared/server/articles.resource';
import { Article, ArticleList } from '../shared/server/rest-api.model';
import { ItemsGroup, itemsGrouper } from '../shared/items-grouper';

@Component({
  selector: 'lc-article-list',
  templateUrl: './article-list.component.html'
})
export class ArticleListComponent extends BaseList<Article> {

  articleGroups: Array<ItemsGroup<Article>>;

  constructor(
    private articlesResource: ArticlesResource,
  ) {
    super(articlesResource);
  }

  protected init(): void {
    this.articlesResource.list().subscribe((articles: ArticleList) => {
      this.groupArticles(articles);
    });
  }

  private groupArticles(articles: ArticleList): void {
    this.articleGroups = itemsGrouper(
      (item: Article) => item.time.format('YYYYMM'),
      (item: Article) => {
        return {
          title: item.time.format('MMMM YYYY'),
          data: item.time.clone().startOf('month'),
          items: []
        };
      },
      (article) => article,
      articles
    );
  }

  missingInfo(article: Article): string {
    let missing: Array<String> = [];
    if (article.contentHtml == undefined || article.contentRaw.trim().length < 12) {
      missing.push('innehåll');
    }
    if (article.recordingStatus === 'EXPECTING_RECORDING') {
      missing.push('media');
    }
    if (missing.length > 0) {
      return `Saknar ${missing.join(' & ')}`;
    }
    return undefined;
  }
}
