import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"]
})
export class CourseComponent implements OnInit, AfterViewInit {
  courseId: string;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild("searchInput", { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params["id"];

    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
  }

  ngAfterViewInit() {
    /**
     * With concat, the fn works as expected but we can still do the same with less code.
     */
    // const searchLessons$ = fromEvent<any>(
    //   this.input.nativeElement,
    //   "keyup"
    // ).pipe(
    //   map(event => event.target.value),
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   switchMap(search => this.loadLessons(search))
    // );

    // const initialLesson$ = this.loadLessons();

    // this.lessons$ = concat(initialLesson$, searchLessons$);

    this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup").pipe(
      map(event => event.target.value),
      startWith(""),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(search => this.loadLessons(search))
    );
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map(res => res["payload"]));
  }
}
