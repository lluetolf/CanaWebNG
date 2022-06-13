import {BehaviorSubject, Observable, of} from 'rxjs';
import hash from 'hash-it';
import * as dayjs from 'dayjs';
import {map} from "rxjs/operators";
import {BaseEntity} from "./base-entity";
import {AuthService} from "../auth/auth.service";
import {LoggingService} from "../logging/logging.service";

export abstract class AbstractCacheService<T extends BaseEntity> {

  readonly CACHE_DURATION_IN_MINUTES = 5;
  readonly DEFAULT_KEY = 'DEFAULT';
  private cache: {
    [id: string]: {
      expires: Date,
      data$: BehaviorSubject<T[]>
    }
  } = {};



  getValue(id: any, object?: any): Observable<T> {
    const items$ = this.getValues(object)

    if(items$) {
      items$.pipe(
        map((data: T[]) => data.filter(x => x.id === id)),
      )
    }

    return of();
  }

  getValues(object?: any): Observable<T[]> | null {
    const key = object ? hash(object).toString() : this.DEFAULT_KEY;
    const item = this.cache ? this.cache[key] : null;
    if (!item) {
      return null
    }

    if (dayjs(new Date()).isAfter(item.expires)) {
      return null
    }

    return item.data$.asObservable();
  }

  setValues(value: Observable<T[]>, object?: any) {
    const key = object ? hash(object).toString() : this.DEFAULT_KEY;
    const expires = dayjs(new Date())
      .add(this.CACHE_DURATION_IN_MINUTES, 'minutes')
      .toDate();

    const entry = this.cache[key]
    if (entry) {
      value.subscribe(x => {
        entry.expires = expires;
        entry.data$.next(x);
      })
    } else {
      value.subscribe(x => {
        this.cache[key] = {
          expires: expires,
          data$: new BehaviorSubject<T[]>(x)
        }
      })
    }
  }

  updateValue(value: T, object?: any)  {
    const key = object ? hash(object).toString() : this.DEFAULT_KEY;
    const item = this.cache ? this.cache[key] : null;
    if (item) {

    }
  }

  clearCache() {
    // @ts-ignore
    this.cache = {}
  }
}
