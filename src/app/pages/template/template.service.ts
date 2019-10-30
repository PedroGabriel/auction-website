import { Routes, Route } from '@angular/router';
import { TemplateComponent } from './template.component';

/**
 * Provides helper methods to create routes.
 */
export class Template {
  /**
   * Creates routes using the template component and authentication.
   * @param routes The routes to add.
   * @return The new route using template as the base.
   */
  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: TemplateComponent,
      children: routes,
      canActivate: [],
      // Reuse TemplateComponent instance when navigating between child views
      data: { reuse: true }
    };
  }
}
