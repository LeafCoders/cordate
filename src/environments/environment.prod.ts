type CordateConfig = {
  rosetteUrl: string,
  applicationName: string,
};

function readCordateConfiguration(): CordateConfig {
  const cordateConfig: CordateConfig = (<any>window).cordateConfig;
  return cordateConfig ? cordateConfig : <CordateConfig>{};
}

function endWithSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

export const environment = {
  production: true,

  rosetteUrl: endWithSlash(readCordateConfiguration().rosetteUrl),
  applicationName: readCordateConfiguration().applicationName,
};