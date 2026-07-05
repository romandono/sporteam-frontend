import { Component, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styles: [],
    standalone: false
})
export class BreadcrumbsComponent implements OnDestroy{

  public titulo: string = "";
  public tituloSub$: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {

    this.tituloSub$ = this.getArgumentosRuta()
          .subscribe( data => {
          this.titulo = data.titulo;
          document.title = `Sporteam - ${data.titulo}`;
      });

  }

  ngOnDestroy(): void {
    this.tituloSub$.unsubscribe();
  }

   getArgumentosRuta() {
      return this.router.events
        .pipe(
          filter( (event): event is ActivationEnd => event instanceof ActivationEnd ),
          filter( (event): event is ActivationEnd =>  event.snapshot.firstChild === null),
          map( (event: ActivationEnd) => event.snapshot.data)
        );
   }

}
