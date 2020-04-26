import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { of, concat, interval, merge } from "rxjs";
import { map } from "rxjs/operators";
import { createHttpObservable } from "../common/util";
@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // https://www.learnrxjs.io/learn-rxjs/operators/combination/concat
    const arr1$ = of(1, 2, 3);
    const arr2$ = of(4, 5, 6);
    const arr3$ = of(7, 8, 9);

    const result$ = concat(arr1$, arr2$, arr3$);

    const res = result$.subscribe(console.log);
    setTimeout(() => res.unsubscribe(), 5000);
    // Merge operator

    const interval1$ = interval(1000);
    const interval2$ = interval1$.pipe(map(val => val * 10));

    const result1$ = merge(interval1$, interval2$);

    const sub = result1$.subscribe(console.log);

    setTimeout(() => sub.unsubscribe(), 5000);

    //Cancallable http requet

    const http$ = createHttpObservable("/api/courses");
    const apiSub = http$.subscribe(console.log);

    setTimeout(() => apiSub.unsubscribe(), 0);
  }
}
