import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { Article, ArticleSerie, ArticleSerieList } from '../../shared/server/rest-api.model';
import { ArticleSeriesResource } from '../../shared/server/article-series.resource';

@Component({
  selector: 'lc-article-new-dialog',
  templateUrl: './article-new-dialog.component.html',
  styleUrls: ['./article-new-dialog.component.scss']
})
export class ArticleNewDialogComponent implements OnInit {

  newTitle: string;
  articleSeries: ArticleSerieList;

  constructor(
    public dialogRef: MatDialogRef<ArticleNewDialogComponent>,
    private articleSeriesResource: ArticleSeriesResource,
  ) {
  }

  ngOnInit() {
    this.articleSeriesResource.list().subscribe((articleSeries: ArticleSerieList) => this.articleSeries = articleSeries);
  }

  selectArticleSerie(serie: ArticleSerie): void {
    this.dialogRef.close(serie);
  }

}
