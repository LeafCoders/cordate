/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UploadListComponent } from './upload-list.component';

describe('UploadListComponent', () => {
  let component: UploadListComponent;
  let fixture: ComponentFixture<UploadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
