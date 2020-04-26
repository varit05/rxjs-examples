import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, timer, noop } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  public beginnerCourses$: Observable<Course[]>;
  public advanceCourses$: Observable<Course[]>;

  constructor() {}

  ngOnInit() {
    // Create a new Observable operator defination
    const http$: Observable<Course[]> = createHttpObservable("/api/courses");

    const courses$ = http$.pipe(
      tap(() => console.log("http request")),
      map(res => res["payload"]),
      shareReplay(),
      retryWhen(errors => errors.pipe(delayWhen(() => timer(2000))))
    );

    this.beginnerCourses$ = courses$.pipe(
      map((courses: Course[]) =>
        courses.filter(course => course.category === "BEGINNER")
      )
    );
    this.advanceCourses$ = courses$.pipe(
      map((courses: Course[]) =>
        courses.filter(course => course.category === "ADVANCED")
      )
    );

    /**
     * Subscribe inside subscribe is not a good pattern to work with observables
     */
    // courses$.subscribe(
    //   courses => {
    //     this.beginnerCourses = courses.filter(
    //       course => course.category === "BEGINNER"
    //     );
    //     this.advanceCourses = courses.filter(
    //       course => course.category === "ADVANCED"
    //     );
    //     console.log("this.beginnerCourses", this.beginnerCourses);
    //     console.log("this.advanceCourses", this.advanceCourses);
    //   },
    //   noop,
    //   () => console.log("completed")
    // );
  }
}
