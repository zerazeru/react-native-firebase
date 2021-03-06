/*
 * Copyright (c) 2016-present Invertase Limited & Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this library except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {
  ReactNativeFirebaseModule,
  ReactNativeFirebaseNamespace,
  ReactNativeFirebaseModuleAndStatics,
} from '@react-native-firebase/app-types';

/**
 * Firebase Remote Config is a cloud service that lets you change the behavior and appearance of your
 * app without requiring users to download an app update. When using Remote Config, you create in-app default
 * values that control the behavior and appearance of your app.
 *
 * @firebase config
 */
export namespace Config {
  export interface Statics {}

  /**
   * An Interface representing a Remote Config value
   */
  export interface ConfigValue {
    /**
     * Where the value was retrieved from
     */
    source: 'remote' | 'default' | 'static';

    /**
     * The value
     */
    value: undefined | number | boolean | string;
  }

  /**
   * An Interface representing multiple Config Values
   */
  export interface ConfigValues {
    [key: string]: ConfigValue;
  }

  /**
   * An Interface representing settable config settings.
   */
  export interface ConfigSettingsWrite {
    isDeveloperModeEnabled: boolean;
  }

  /**
   * An Interface representing readable config settings.
   */
  export interface ConfigSettingsRead {
    lastFetchTime: number;
    isDeveloperModeEnabled: boolean;
    lastFetchStatus: 'success' | 'failure' | 'no_fetch_yet' | 'throttled';
  }

  /**
   * An Interface representing a Config Defaults object.
   */
  export interface ConfigDefaults {
    [key: string]: number | string | boolean;
  }

  export interface Module extends ReactNativeFirebaseModule {
    /**
     * Moves fetched data to the apps active config.
     * Resolves with a boolean value of whether the fetched config was moved successfully.
     */
    activateFetched(): Promise<boolean>;

    /**
     * Fetches the remote config data from Firebase, as defined in the dashboard. If duration is defined (seconds), data will be locally cached for this duration.
     *
     * @param cacheExpirationSeconds Duration in seconds to cache the data for. To skip cache, use a duration of 0.
     */
    fetch(cacheExpirationSeconds?: number): Promise<null>;

    /**
     * Fetches the remote config data from Firebase, as defined in the dashboard. If duration is defined (seconds), data will be locally cached for this duration.
     *
     * Once fetching is complete this method immediately calls activateFetched and returns a boolean value of the activation status.
     *
     * @param cacheExpirationSeconds Duration in seconds to cache the data for. To skip cache use a duration of 0.
     */
    fetchAndActivate(cacheExpirationSeconds?: number): Promise<boolean>;

    /**
     * Retrieve the configuration settings and status for Remote Config.
     */
    getConfigSettings(): Promise<ConfigSettingsRead>;

    /**
     * Returns all keys matching the prefix as an array. If no prefix is defined all keys are returned.
     *
     * @param prefix A prefix value to match keys by. Leave blank to retrieve all keys.
     */
    getKeysByPrefix(prefix?: string): Promise<string[]>;

    /**
     * Returns all config values for the keys matching the prefix provided. In no prefix is provided all values are returned.
     *
     * @param prefix A prefix value to match values by. Leave blank to retrieve all values.
     */
    getValuesByKeysPrefix(prefix?: string): Promise<ConfigValues>;

    /**
     * Gets a ConfigValue by key.
     *
     * @param key A key used to retrieve a specific value.
     */
    getValue(key: string): Promise<ConfigValue>;

    /**
     * Set the Remote Config settings, specifically the `isDeveloperModeEnabled` flag.
     *
     * @param configSettings A ConfigSettingsWrite instance used to set Remote Config settings.
     */
    setConfigSettings(configSettings: ConfigSettingsWrite): Promise<ConfigSettingsRead>;

    /**
     * Sets default values for the app to use when accessing values.
     * Any data fetched and activated will override any default values. Any values in the defaults but not on Firebase will be untouched.
     *
     * @param defaults A ConfigDefaults instance used to set default values.
     */
    setDefaults(defaults: ConfigDefaults): Promise<null>;

    /**
     * Sets the default values from a resource file.
     * On iOS this is a plist file and on Android this is an XML defaultsMap file.
     *
     * @link /guides/todo
     *
     * @param resourceName The plist/xml file name with no extension.
     */
    setDefaultsFromResource(resourceName: string): Promise<null>;
  }
}

declare module '@react-native-firebase/config' {
  import { ReactNativeFirebaseNamespace } from '@react-native-firebase/app-types';

  const FirebaseNamespaceExport: {} & ReactNativeFirebaseNamespace;

  /**
   * @example
   * ```js
   * import { firebase } from '@react-native-firebase/config';
   * firebase.config().X(...);
   * ```
   */
  export const firebase = FirebaseNamespaceExport;

  const ConfigDefaultExport: ReactNativeFirebaseModuleAndStatics<Config.Module, Config.Statics>;
  /**
   * @example
   * ```js
   * import config from '@react-native-firebase/config';
   * config().X(...);
   * ```
   */
  export default ConfigDefaultExport;
}

/**
 * Attach namespace to `firebase.` and `FirebaseApp.`.
 */
declare module '@react-native-firebase/app-types' {
  interface ReactNativeFirebaseNamespace {
    /**
     * Firebase Remote Config is a cloud service that lets you change the behavior and appearance of your
     * app without requiring users to download an app update. When using Remote Config, you create in-app default
     * values that control the behavior and appearance of your app.
     */
    config: ReactNativeFirebaseModuleAndStatics<Config.Module, Config.Statics>;
  }

  interface FirebaseApp {
    /**
     * Firebase Remote Config is a cloud service that lets you change the behavior and appearance of your
     * app without requiring users to download an app update. When using Remote Config, you create in-app default
     * values that control the behavior and appearance of your app.
     */
    config(): Config.Module;
  }
}
