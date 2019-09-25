import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ArticleSeriesResource } from '../shared/server/article-series.resource';
import { ArticleTypesResource } from '../shared/server/article-types.resource';
import { ArticlesResource } from '../shared/server/articles.resource';
import { Article, ArticleSerie, TimeRange } from '../shared/server/rest-api.model';
import { SingleSelectDialogComponent } from '../shared/dialog/single-select-dialog/single-select-dialog.component';
import { ArticleService } from './article.service';

@Component({
  selector: 'lc-article',
  templateUrl: './article.component.html'
})
export class ArticleComponent extends BaseContainer<Article> {

  private ranges: Array<TimeRange>;
  selectedRangeIndex: number = 0;
  selectedRangeText: string;

  constructor(
    public viewData: ArticleService,
    private articlesResource: ArticlesResource,
    private articleSeriesResource: ArticleSeriesResource,
    private authPermission: AuthPermissionService,
    private dialog: MatDialog,
    articleTypesResource: ArticleTypesResource,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(articlesResource, router, route);
    this.viewData.articleType = articleTypesResource.fromRoute(route);

    const lastWeek: moment.Moment = moment().startOf('week').subtract(1, 'week');
    const semester: number = Math.floor(moment().month() / 6);
    let semesterStart: moment.Moment = moment().startOf('month').month(6 * semester);
    if (lastWeek.isBefore(semesterStart)) {
      semesterStart = semesterStart.subtract(6, 'month');
    }
    this.ranges = [
      { start: lastWeek, end: undefined },
      { start: semesterStart, end: undefined },
      { start: semesterStart.clone().subtract(6, 'month'), end: semesterStart.clone() },
    ]
    this.updateRange();
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.articlesResource.createPermission());
  }

  showNewDialog(): void {
    this.dialog.open(SingleSelectDialogComponent).componentInstance.init(
      this.viewData.articleType.newArticleTitle, this.articleSeriesResource.listOnce(),
      (articleSerie: ArticleSerie) => {
        this.openEditorWithNew(new Article({
          articleTypeId: this.viewData.articleType.id,
          articleSerie: articleSerie.asRef(),
          recordingStatus: this.viewData.articleType.defaultRecordingStatus,
        }));
      });
  }

  moveRange(forward: boolean): void {
    this.selectedRangeIndex = Math.max(0, this.selectedRangeIndex + (forward ? -1 : 1));
    while (this.selectedRangeIndex >= this.ranges.length) {
      this.ranges.push({
        start: this.ranges[this.ranges.length - 1].start.clone().subtract(6, 'month'),
        end: this.ranges[this.ranges.length - 1].end.clone().subtract(6, 'month'),
      });
    }
    this.updateRange();
  }

  private updateRange(): void {
    const from: moment.Moment = this.ranges[this.selectedRangeIndex].start;
    const before: moment.Moment = this.ranges[this.selectedRangeIndex].end;
    this.articlesResource.setListParams({
      articleTypeId: this.viewData.articleType.id,
      from: from.toJSON(),
      before: before ? before.toJSON() : undefined,
    });
    if (this.selectedRangeIndex === 0) {
      this.selectedRangeText = `Från förra veckan`;
    } else if (from && before) {
      this.selectedRangeText = `${from.format("MMM YYYY")} - ${before.clone().subtract(1, 'month').format("MMM YYYY")}`;
    } else {
      this.selectedRangeText = `Från ${from.format("MMM YYYY")}`;
    }
  }
}
