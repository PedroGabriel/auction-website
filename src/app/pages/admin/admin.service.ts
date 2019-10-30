import { Routes, Route } from '@angular/router';
import { AuthenticationGuardAdmin } from '@app/core';
import { AdminComponent } from './admin.component';

/**
 * Provides helper methods to create routes.
 */
export class Admin {
  /**
   * Creates routes using the admin component and authentication.
   * @param routes The routes to add.
   * @return The new route using admin as the base.
   */
  static childRoutes(routes: Routes): Route {
    return {
      path: 'admin',
      component: AdminComponent,
      children: routes,
      canActivate: [AuthenticationGuardAdmin],
      // Reuse AdminComponent instance when navigating between child views
      data: { reuse: true }
    };
  }
}
