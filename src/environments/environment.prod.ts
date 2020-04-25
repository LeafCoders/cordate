type CordateConfig = {
  rosetteUrl: string,
  applicationName: string,
};

export function readCordateConfiguration(): CordateConfig {
  const cordateConfig: CordateConfig = (<any>window).cordateConfig;
  return cordateConfig ? cordateConfig : <CordateConfig>{};
}

export function endWithSlash(url: string): string {
  if (url && url.trim().length > 0) {
    return url.endsWith('/') ? url : `${url}/`;
  }
  return undefined;
}

export const environment = {
  production: true,

  rosetteUrl: endWithSlash(readCordateConfiguration().rosetteUrl),
  applicationName: readCordateConfiguration().applicationName,
};