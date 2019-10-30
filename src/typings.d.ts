/*
 * Extra typings definitions
 */

// Allow .json files imports
declare module '*.json';

declare var stripe: any;
declare var elements: any;

// SystemJS module definition
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
